import { describe, expect, it } from "vitest";
import { Box3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { frameBox, framePlane } from "./scene";
import type { FocusFrame } from "./scene";

const FOV = 45;

/** Projects every corner of `box` through a camera at `frame`, in NDC. */
const projectCorners = (box: Box3, frame: FocusFrame, aspect: number) => {
  const camera = new PerspectiveCamera(FOV, aspect);
  camera.position.copy(frame.position);
  camera.lookAt(frame.target);
  camera.updateMatrixWorld();

  const ndc: Vector3[] = [];
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z])
        ndc.push(new Vector3(x, y, z).project(camera));
  return ndc;
};

const edge = (ndc: Vector3[]) =>
  Math.max(...ndc.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)]));

describe("frameBox", () => {
  // Deliberately lopsided: tall, thin, off-origin.
  const box = new Box3(new Vector3(1, 2, 3), new Vector3(1.4, 3.5, 3.2));
  const direction = new Vector3(0.5, 0.65, 0.5);
  const cases = [
    ["landscape", 16 / 9],
    ["portrait phone", 9 / 19.5],
    ["square", 1],
  ] as const;

  it("targets the box centre", () => {
    const { target } = frameBox({ box, direction, fov: FOV, aspect: 16 / 9 });
    expect(target.toArray()).toEqual(box.getCenter(new Vector3()).toArray());
  });

  it("places the camera along the given direction", () => {
    const { position, target, distance } = frameBox({
      box,
      direction: direction.clone().multiplyScalar(7), // length must not matter
      fov: FOV,
      aspect: 16 / 9,
    });
    const offset = position.clone().sub(target);
    expect(offset.length()).toBeCloseTo(distance);
    expect(offset.normalize().dot(direction.clone().normalize())).toBeCloseTo(1);
  });

  for (const [label, aspect] of cases) {
    it(`keeps every corner on screen, edge to edge, on a ${label} screen`, () => {
      const frame = frameBox({ box, direction, fov: FOV, aspect, padding: 1 });
      const ndc = projectCorners(box, frame, aspect);

      expect(ndc.every((p) => p.z < 1)).toBe(true); // all in front of the camera
      expect(edge(ndc)).toBeCloseTo(1, 5); // tight: something touches an edge
    });
  }

  it("leaves a margin equal to the padding", () => {
    const aspect = 16 / 9;
    const frame = frameBox({ box, direction, fov: FOV, aspect, padding: 1.25 });
    // Padding divides the frustum tangent, i.e. the NDC extent.
    expect(edge(projectCorners(box, frame, aspect))).toBeCloseTo(1 / 1.25, 5);
  });

  describe('align: "top"', () => {
    const topOf = (ndc: Vector3[]) => Math.max(...ndc.map((p) => p.y));
    const bottomOf = (ndc: Vector3[]) => Math.min(...ndc.map((p) => p.y));
    // Wide, like an item with its bubble: on a portrait screen the fit is
    // width-bound, which leaves spare height to place it in.
    const wide = new Box3(new Vector3(0, 4, 0), new Vector3(1.6, 4.9, 0.4));
    const aspect = 9 / 19.5;

    it("pins the box to the top edge and leaves the spare height below", () => {
      const frame = frameBox({
        box: wide,
        direction,
        fov: FOV,
        aspect,
        padding: 1,
        align: "top",
      });
      const ndc = projectCorners(wide, frame, aspect);

      expect(topOf(ndc)).toBeCloseTo(1, 5);
      expect(bottomOf(ndc)).toBeGreaterThan(-1);
      expect(edge(ndc)).toBeCloseTo(1, 5); // still entirely on screen
    });

    it("keeps the distance and view direction of a centred fit", () => {
      const centred = frameBox({ box: wide, direction, fov: FOV, aspect });
      const top = frameBox({ box: wide, direction, fov: FOV, aspect, align: "top" });

      expect(top.distance).toBeCloseTo(centred.distance);
      const dir = (f: FocusFrame) => f.position.clone().sub(f.target).normalize();
      expect(dir(top).dot(dir(centred))).toBeCloseTo(1);
      expect(top.target.y).toBeLessThan(centred.target.y);
    });
  });

  it("zooms in proportionally on a smaller room", () => {
    const small = new Box3(
      box.min.clone().multiplyScalar(0.7),
      box.max.clone().multiplyScalar(0.7)
    );
    const full = frameBox({ box, direction, fov: FOV, aspect: 1 });
    const mobile = frameBox({ box: small, direction, fov: FOV, aspect: 1 });
    expect(mobile.distance).toBeCloseTo(full.distance * 0.7);
  });
});

describe("framePlane", () => {
  const base = {
    center: new Vector3(0, 0, 0),
    normal: new Vector3(1, 0, 1),
    width: 2,
    height: 1.2,
    fov: FOV,
    padding: 1,
  };

  it("looks at the plane face-on along its normal", () => {
    const { position, target } = framePlane({ ...base, aspect: 16 / 9 });
    expect(target.toArray()).toEqual([0, 0, 0]);
    expect(position.x).toBeCloseTo(position.z);
    expect(position.y).toBeCloseTo(0);
  });

  it("is bound by height on a wide screen", () => {
    const { distance } = framePlane({ ...base, aspect: 21 / 9 });
    const vHalf = MathUtils.degToRad(FOV) / 2;
    expect(distance).toBeCloseTo(base.height / 2 / Math.tan(vHalf));
  });

  it("is bound by width on a portrait screen", () => {
    const aspect = 9 / 19.5;
    const { distance } = framePlane({ ...base, aspect });
    const hHalf = Math.atan(Math.tan(MathUtils.degToRad(FOV) / 2) * aspect);
    expect(distance).toBeCloseTo(base.width / 2 / Math.tan(hHalf));
  });
});
