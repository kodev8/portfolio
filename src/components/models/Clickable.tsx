import { useRef, useState, useEffect } from "react";
import type { ReactNode, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Color } from "three";
import { useThree } from "@react-three/fiber";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";
import type { OrbitControls } from "three-stdlib";
import { useHero } from "../../context/HeroContext";
import gsap from "gsap";
import * as THREE from "three";
import { aboutMe } from "../../constants";
import type { Vec3 } from "../../constants/scenePositions";
import {
  frameBox,
  framePlane,
  panelLocalSize,
  resetScene,
  setRoomFullscreen,
} from "../../utils/scene";
import type { FocusFrame } from "../../utils/scene";
import FloatingInfoPanel from "../animations/FloatingInfoPanel";
import { useMedia } from "../../context/MediaContext";
import { useLanguage } from "../../context/LanguageContext";

type GroupProps = ThreeElements["group"];

interface ClickableProps extends GroupProps {
  children?: ReactNode;
  roomRef?: RefObject<THREE.Group | null>;
  onClick?: () => void;
  position?: Vec3;
  scale?: number | Vec3;
  clickableOffset?: Vec3;
  viewableOffset?: Vec3;
  viewPadding?: number;
  viewAlign?: "center" | "top";
  frameSize?: [number, number];
  label?: string;
  color?: string;
  name?: string;
  ringScale?: number;
  withRing?: boolean;
  speechOffset?: Vec3;
  speechDirection?: "up" | "down";
}

const Clickable = ({
  children,
  roomRef,
  onClick,
  position = [0, 0, 0],
  // scale/label are consumed here (not forwarded to <group>) so that spreading
  // an itemData entry into <Clickable> doesn't also scale the wrapper group.
  scale: _scale = 1,
  label: _label = "Click",
  clickableOffset = [1, 1, 0], // clickable offset
  viewableOffset = [0, 0, 0],
  viewPadding,
  viewAlign,
  frameSize,
  color = "#ffffff",
  name = "",
  ringScale = 0.25,
  withRing = true,
  speechOffset = [0, 0, 0],
  speechDirection = "down",
  ...props
}: ClickableProps) => {
  const { language } = useLanguage();
  const { isMobile } = useMedia();
  const itemRef = useRef<THREE.Group>(null);
  // Wraps only the model, so the ring and speech bubble don't skew its bounds.
  const contentRef = useRef<THREE.Group>(null);
  const { camera, controls: rawControls } = useThree();
  const controls = rawControls as unknown as OrbitControls;
  const { isInteracting, setIsInteracting, isAnimating, setIsAnimating } = useHero();
  const { selectedItem, setSelectedItem } = useHero();
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const isScreen = name === "leftScreen" || name === "rightScreen";
  const hasPanel = !isScreen && !!aboutMe[name];

  /** World-space box around the model and, if it will show, its speech bubble. */
  const focusBounds = () => {
    const box = new THREE.Box3().setFromObject(contentRef.current!);
    if (hasPanel) {
      const item = itemRef.current!;
      const { width, height } = panelLocalSize(isMobile);
      const anchor = item.localToWorld(new THREE.Vector3(...speechOffset));
      const half = new THREE.Vector3(width / 2, height / 2, width / 2).multiply(
        item.getWorldScale(new THREE.Vector3())
      );
      box.expandByPoint(anchor.clone().add(half));
      box.expandByPoint(anchor.clone().sub(half));
    }
    return box;
  };

  /** Where the camera should end up to frame this item on the current screen. */
  const focusFrame = (): FocusFrame => {
    const item = itemRef.current!;
    const { fov, aspect } = camera as THREE.PerspectiveCamera;

    if (frameSize) {
      const scale = item.getWorldScale(new THREE.Vector3());
      return framePlane({
        center: contentRef.current!.getWorldPosition(new THREE.Vector3()),
        normal: new THREE.Vector3(0, 0, 1).applyQuaternion(
          item.getWorldQuaternion(new THREE.Quaternion())
        ),
        width: frameSize[0] * scale.x,
        height: frameSize[1] * scale.y,
        fov,
        aspect,
        padding: viewPadding,
      });
    }

    const box = focusBounds();
    const direction = new THREE.Vector3(...viewableOffset);
    if (direction.lengthSq() === 0) {
      direction.subVectors(camera.position, box.getCenter(new THREE.Vector3()));
    }

    return frameBox({
      box,
      direction,
      fov,
      aspect,
      padding: viewPadding,
      align: viewAlign,
    });
  };

  const focusOnItem = (e: ThreeEvent<MouseEvent>) => {
    // r3f delivers one click per intersected mesh, and they all bubble here.
    // Without this, a model made of 4 meshes starts 4 competing focus tweens.
    e.stopPropagation();
    // Already there. Also what keeps clicks on the monitor's desktop overlay,
    // which bubble into the scene, from replaying the zoom under it.
    if (isAnimating || (isInteracting && selectedItem?.name === name)) return;
    setIsInteracting(true);
    setIsAnimating(true);
    controls.enabled = false;

    const itemPosition = new THREE.Vector3();
    itemRef.current!.getWorldPosition(itemPosition);
    setSelectedItem({
      name: name,
      position: itemPosition,
      details: aboutMe[name],
    });

    if (hasPanel) {
      setShowInfoPanel(true);
    }

    // Filled in when the camera starts moving: going fullscreen resizes the
    // canvas first, and the fit depends on its final aspect ratio.
    let frame: FocusFrame;
    const fromPosition = new THREE.Vector3();
    const fromTarget = new THREE.Vector3();
    const progress = { t: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    tl.to(
      [
        ".navbar",
        ".hero-text",
        "header p",
        "#button",
        "#hero-bg",
        ".hero-layout-header",
      ],
      {
        opacity: 0,
        zIndex: -1,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => void setRoomFullscreen(true),
      }
    );

    // Camera and orbit target move on one tween so they can't drift apart.
    // controls.update() is held off until the end: it clamps to min/maxDistance
    // on every call, which used to shove close-ups back out mid-flight.
    tl.to(
      progress,
      {
        t: 1,
        duration: isScreen ? 1.2 : 1,
        ease: "sine.inOut",
        onStart: () => {
          frame = focusFrame();
          fromPosition.copy(camera.position);
          fromTarget.copy(controls.target);
        },
        onUpdate: () => {
          camera.position.lerpVectors(fromPosition, frame.position, progress.t);
          controls.target.lerpVectors(fromTarget, frame.target, progress.t);
          camera.lookAt(controls.target);
        },
        onComplete: () => {
          // Pin the distance to the fit, so orbiting can't drift out of frame.
          controls.minDistance = frame.distance;
          controls.maxDistance = frame.distance;
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.update();

          setTimeout(() => {
            setIsAnimating(false);
            // The monitor keeps orbit off: its desktop needs every drag and
            // scroll, and the back arrow / Escape still leave.
            controls.enabled = !isScreen;
          }, 100);

          onClick?.();
        },
      },
      // A beat for r3f to pick up the fullscreen canvas size.
      "+=0.05"
    );
  };

  const resetCamera = () => {
    // Hide info panel when resetting
    setShowInfoPanel(false);

    resetScene(
      camera,
      controls,
      roomRef ?? null,
      setIsInteracting,
      setSelectedItem,
      isAnimating,
      setIsAnimating
    );
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      // Every Clickable listens; only the focused one resets, or each
      // keypress would launch one competing reset per item in the room.
      if (
        e.key === "Escape" &&
        isInteracting &&
        !isAnimating &&
        selectedItem?.name === name
      ) {
        resetCamera();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isInteracting, isAnimating, selectedItem, name]);

  const ringRef =
    useRef<THREE.Mesh<THREE.RingGeometry, THREE.MeshStandardMaterial>>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 5) * 0.1;

    if (ringRef.current) {
      ringRef.current.scale.set(pulse, pulse, pulse);
      // ringRef.current.material.opacity = hovered ? 0.9 : 0.5;
    }
  });

  useFrame((state) => {
    if (ringRef.current) {
      const pulseFactor = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
      ringRef.current.material.emissiveIntensity = 20 * pulseFactor;
    }
  });

  // Hide info panel when selected item changes
  useEffect(() => {
    if (selectedItem?.name !== name) {
      setShowInfoPanel(false);
    }
  }, [selectedItem, name]);

  const handleLinkClick = (href: string) => {
    // Handle internal navigation
    if (href.startsWith("#")) {
      // First reset the camera view
      resetCamera();

      // Then scroll to the section after a short delay
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 600); // Wait for camera reset animation
    }
  };

  return (
    <group ref={itemRef} position={position} onClick={focusOnItem} {...props}>
      {withRing && (
        <mesh
          ref={ringRef}
          position={clickableOffset}
          rotation={[-Math.PI / 2, 0, 0]} // Flat on the ground
        >
          <ringGeometry args={[ringScale * 0.7, ringScale, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={new Color(color)}
            emissiveIntensity={2}
            side={DoubleSide}
            transparent={true}
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
      )}

      <group ref={contentRef}>{children}</group>

      {/* Show info panel for non-screen items */}
      {hasPanel && showInfoPanel && selectedItem?.name === name && (
        <FloatingInfoPanel
          content={aboutMe[name][language]}
          position={speechOffset}
          visible={showInfoPanel}
          onLinkClick={handleLinkClick}
          speechDirection={speechDirection}
        />
      )}
    </group>
  );
};

export default Clickable;
