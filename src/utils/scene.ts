import gsap from "gsap";
import { Box3, MathUtils, Vector3 } from "three";
import type { Camera, Group } from "three";
import type { OrbitControls } from "three-stdlib";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SelectedItem } from "../types";
import { ORIGINAL_CAMERA_POSITION } from "../components/scenes/HeroExperience";

const FULLSCREEN_SLIDE = 0.45;

/**
 * Pins the room fullscreen while an item is in focus (see index.css), or
 * releases it. The layout switches at once, which would jump the canvas by the
 * navbar's height, so the box then slides over from where it was (FLIP).
 */
export const setRoomFullscreen = (on: boolean) => {
  const box = document.querySelector<HTMLElement>(".hero-3d-layout");
  // Slide the child, not the box itself: the box carries Tailwind's
  // -translate-y-*, which gsap would fold into its transform and drop.
  const slider = box?.firstElementChild as HTMLElement | null | undefined;
  const from = box?.getBoundingClientRect();

  if (slider) {
    gsap.killTweensOf(slider);
    gsap.set(slider, { clearProps: "transform" });
  }
  document.body.classList.toggle("is-interacting", on);
  if (!box || !slider || !from) return Promise.resolve();

  const to = box.getBoundingClientRect();
  return gsap.fromTo(
    slider,
    { x: from.left - to.left, y: from.top - to.top },
    {
      x: 0,
      y: 0,
      duration: FULLSCREEN_SLIDE,
      ease: "power2.inOut",
      clearProps: "transform",
    }
  );
};

export const resetScene = (
  camera: Camera,
  controls: OrbitControls,
  roomRef: RefObject<Group | null> | null,
  setIsInteracting: Dispatch<SetStateAction<boolean>>,
  setSelectedItem: Dispatch<SetStateAction<SelectedItem | null>>,
  isAnimating: boolean,
  setIsAnimating: Dispatch<SetStateAction<boolean>>
) => {
  if (isAnimating) return;

  // Claim the camera for the whole reset, so a click on another item can't
  // start a focus tween that fights this one.
  setIsAnimating(true);
  controls.enabled = false;

  const fromPosition = camera.position.clone();
  const fromTarget = controls.target.clone();
  const home = new Vector3(...ORIGINAL_CAMERA_POSITION);
  const origin = new Vector3();
  const progress = { t: 0 };

  const tl = gsap.timeline();

  // Same single tween as the way in: position and look target move together,
  // so the view turns smoothly instead of snapping to the room centre.
  tl.to(progress, {
    t: 1,
    duration: 0.8,
    ease: "sine.inOut",
    onUpdate: () => {
      camera.position.lerpVectors(fromPosition, home, progress.t);
      controls.target.lerpVectors(fromTarget, origin, progress.t);
      camera.lookAt(controls.target);
    },
    onComplete: () => {
      setIsInteracting(false);
      setSelectedItem(null);

      // Reset any special constraints that might have been set
      controls.enablePan = false;
      controls.enableZoom = true;

      setRoomFullscreen(false).then(() => {
        controls.enabled = true;
        setIsAnimating(false);
      });
    },
  });

  // Only reset room position if roomRef exists
  if (roomRef && roomRef.current) {
    gsap.to(roomRef.current.position, {
      x: 0,
      y: -3.5, // This is the original y position from HeroExperience.jsx
      z: 0,
      duration: 0.5,
    });

    // Also reset rotation if needed
    gsap.to(roomRef.current.rotation, {
      x: 0,
      y: -Math.PI / 4, // Original rotation from HeroExperience.jsx
      z: 0,
      duration: 0.5,
    });
  }

  // Then fade UI elements back in
  tl.to(
    [".navbar", ".hero-text", "header p", "#button", "#hero-bg", ".hero-layout-header"],
    {
      opacity: 1,
      duration: 0.3,
      zIndex: 48,
      stagger: 0.05,
    },
    "-=0.1"
  );
};

/** Frustum half-angles (radians) for a perspective camera. */
const halfFov = (fov: number, aspect: number) => {
  const vertical = MathUtils.degToRad(fov) / 2;
  const horizontal = Math.atan(Math.tan(vertical) * aspect);
  return { vertical, horizontal };
};

export interface FocusFrame {
  position: Vector3;
  target: Vector3;
  distance: number;
}

/**
 * Camera pose that fits every corner of `box` in view, looking from `direction`.
 * Solves per corner in view space, so it's tight for any shape and on any
 * aspect: portrait phones get fitted by width, wide screens by height.
 */
export const frameBox = ({
  box,
  direction,
  fov,
  aspect,
  padding = 1.1,
  align = "center",
  up = new Vector3(0, 1, 0),
}: {
  box: Box3;
  direction: Vector3;
  fov: number;
  aspect: number;
  padding?: number;
  /**
   * Where the box sits when the fit leaves spare height (portrait screens fit
   * by width). "top" pins it to the top margin, so a near-level view of
   * something high up shows what's below it instead of the void over the wall.
   */
  align?: "center" | "top";
  up?: Vector3;
}): FocusFrame => {
  const { vertical, horizontal } = halfFov(fov, aspect);
  const tanV = Math.tan(vertical) / padding;
  const tanH = Math.tan(horizontal) / padding;

  const center = box.getCenter(new Vector3());
  const back = direction.clone().normalize(); // centre -> camera
  const right = new Vector3().crossVectors(up, back).normalize();
  const viewUp = new Vector3().crossVectors(back, right);

  // Corners relative to the centre, in view space: [right, up, toward camera].
  const corners: [number, number, number][] = [];
  const corner = new Vector3();
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        corner.set(x, y, z).sub(center);
        corners.push([corner.dot(right), corner.dot(viewUp), corner.dot(back)]);
      }

  // A corner at depth `toward` needs the camera at least this far back for
  // its offset to stay inside the frustum.
  let distance = 0;
  for (const [x, y, toward] of corners) {
    distance = Math.max(
      distance,
      Math.abs(x) / tanH + toward,
      Math.abs(y) / tanV + toward
    );
  }

  // Slide camera and target down together until the highest corner meets
  // the top margin. The view direction and distance don't change.
  const target = center.clone();
  if (align === "top") {
    const slack = Math.min(
      ...corners.map(([, y, toward]) => tanV * (distance - toward) - y)
    );
    target.addScaledVector(viewUp, -slack);
  }

  const position = back.multiplyScalar(distance).add(target);
  return { position, target, distance };
};

/**
 * Face-on camera pose that fits a flat rectangle (the monitor) edge to edge.
 * `normal` is the side the rectangle faces.
 */
export const framePlane = ({
  center,
  normal,
  width,
  height,
  fov,
  aspect,
  padding = 1.05,
}: {
  center: Vector3;
  normal: Vector3;
  width: number;
  height: number;
  fov: number;
  aspect: number;
  padding?: number;
}): FocusFrame => {
  const { vertical, horizontal } = halfFov(fov, aspect);
  const distance =
    Math.max(height / 2 / Math.tan(vertical), width / 2 / Math.tan(horizontal)) *
    padding;
  const position = normal.clone().normalize().multiplyScalar(distance).add(center);

  return { position, target: center.clone(), distance };
};

// drei's <Html transform> renders 400 CSS px per world unit at distanceFactor 1.
const PX_PER_UNIT = 400;
export const panelDistanceFactor = (isMobile: boolean) => (isMobile ? 1.3 : 1);

/**
 * Rough footprint of the bubble in the parent's local units, so the camera
 * can frame it alongside its item. Width is the .speech-bubble max-width at its
 * 0.8 scale; height is a typical few lines of copy.
 */
export const panelLocalSize = (isMobile: boolean) => {
  const perPx = panelDistanceFactor(isMobile) / PX_PER_UNIT;
  return { width: 240 * perPx, height: 200 * perPx };
};
