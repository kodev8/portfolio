import ReactThreeTestRenderer from "@react-three/test-renderer";
import { DoubleSide } from "three";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { describe, expect, it } from "vitest";
import Clickable from "./Clickable";
import { HeroProvider } from "../../context/HeroContext";
import { LanguageProvider } from "../../context/LanguageContext";
import { MediaProvider } from "../../context/MediaContext";
import { itemData } from "../../constants/scenePositions";

type ClickableProps = React.ComponentProps<typeof Clickable>;

const renderClickable = (props: ClickableProps = {}) =>
  ReactThreeTestRenderer.create(
    <LanguageProvider>
      <MediaProvider>
        <HeroProvider>
          <Clickable {...props}>
            <mesh name="payload">
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial />
            </mesh>
          </Clickable>
        </HeroProvider>
      </MediaProvider>
    </LanguageProvider>
  );

/** The <group> Clickable renders, i.e. the wrapper around the model. */
const wrapper = (renderer: Awaited<ReturnType<typeof renderClickable>>) =>
  renderer.scene.findByType("Group").instance as Group;

const payload = (renderer: Awaited<ReturnType<typeof renderClickable>>) =>
  renderer.scene.findAllByType("Mesh").find((m) => m.instance.name === "payload")!
    .instance as Mesh;

describe("Clickable", () => {
  it("renders its child model", async () => {
    const renderer = await renderClickable();
    expect(payload(renderer)).toBeTruthy();
  });

  it("places the wrapper at the given position", async () => {
    const renderer = await renderClickable({ position: [1, 2, 3] });
    expect(wrapper(renderer).position.toArray()).toEqual([1, 2, 3]);
  });

  it("does not apply scale to the wrapper group", async () => {
    // Regression guard. Call sites spread an itemData entry into <Clickable>
    // AND pass the same scale to the child model, so if the wrapper also
    // consumed it the model would render at scale squared.
    const renderer = await renderClickable({ scale: 0.035 });

    expect(wrapper(renderer).scale.toArray()).toEqual([1, 1, 1]);
  });

  it("leaves a spread spiderman entry at unit scale", async () => {
    const renderer = await renderClickable(itemData.spiderman as ClickableProps);
    expect(wrapper(renderer).scale.toArray()).toEqual([1, 1, 1]);
  });

  it("leaves a spread ttflag entry at unit scale", async () => {
    const renderer = await renderClickable(itemData.ttflag as ClickableProps);
    expect(wrapper(renderer).scale.toArray()).toEqual([1, 1, 1]);
  });

  it("still honours rotation from a spread entry", async () => {
    // rotation is meant to reach the group; only scale/label are swallowed.
    const renderer = await renderClickable(itemData.ttflag as ClickableProps);
    expect(wrapper(renderer).rotation.y).toBeCloseTo(Math.PI / 2);
  });

  it("does not leak a label into the three.js object name", async () => {
    const renderer = await renderClickable({ label: "Click me", name: "rubik" });
    expect(wrapper(renderer).name).not.toBe("Click me");
  });

  it("draws the highlight ring by default", async () => {
    const renderer = await renderClickable({ withRing: true, ringScale: 0.25 });
    expect(renderer.scene.findAllByType("Mesh").length).toBeGreaterThan(1);
  });

  it("omits the ring when asked", async () => {
    const withRing = await renderClickable({ withRing: true });
    const without = await renderClickable({ withRing: false });

    expect(without.scene.findAllByType("Mesh").length).toBeLessThan(
      withRing.scene.findAllByType("Mesh").length
    );
  });

  it("offsets the ring independently of the model", async () => {
    const renderer = await renderClickable({
      withRing: true,
      clickableOffset: [0, -0.1, 0],
    });
    const ring = renderer.scene
      .findAllByType("Mesh")
      .find((m) => m.instance !== payload(renderer))!.instance as Mesh;

    expect(ring.position.toArray()).toEqual([0, -0.1, 0]);
  });

  it("lays the ring flat on the ground", async () => {
    const renderer = await renderClickable({ withRing: true });
    const ring = renderer.scene
      .findAllByType("Mesh")
      .find((m) => m.instance !== payload(renderer))!.instance as Mesh;

    expect(ring.rotation.x).toBeCloseTo(-Math.PI / 2);
  });

  it("keeps rendering frames without throwing", async () => {
    // The ring pulse is driven off clock.getElapsedTime(), which this renderer
    // never advances, so the animation itself is not observable here. What is
    // worth pinning is that the frame loop stays alive and the ring survives.
    const renderer = await renderClickable({ withRing: true });

    await ReactThreeTestRenderer.act(async () => {
      renderer.advanceFrames(10, 0.05);
    });

    expect(renderer.scene.findAllByType("Mesh").length).toBeGreaterThan(1);
  });

  it("configures the ring material to glow without writing depth", async () => {
    const renderer = await renderClickable({ withRing: true, color: "#00ff00" });
    const ring = renderer.scene
      .findAllByType("Mesh")
      .find((m) => m.instance !== payload(renderer))!.instance as Mesh;
    const material = ring.material as MeshStandardMaterial;

    expect(material.transparent).toBe(true);
    expect(material.depthWrite).toBe(false);
    expect(material.emissiveIntensity).toBeGreaterThan(0);
    expect(material.side).toBe(DoubleSide);
  });
});
