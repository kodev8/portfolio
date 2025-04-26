import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Color } from "three";
import { useThree } from "@react-three/fiber";
import { useHero } from "../../context/HeroContext";
import gsap from "gsap";
import * as THREE from "three";
import { aboutMe } from "../../constants";
import { resetScene } from "../../utils/scene";
import FloatingInfoPanel from "../animations/FloatingInfoPanel";

const Clickable = ({
  children,
  roomRef,
  onClick,
  position = [0, 0, 0],
  scale = 1,
  clickableOffset = [1, 1, 0], // clickable offset
  viewableOffset = [0, 0, 0],
  label = "Click",
  color = "#ffffff",
  name = "",
  ringScale = 0.25,
  withRing = true,
  speechOffset = [0, 0, 0],
  speechDirection = "down",
  ...props
}) => {
  const itemRef = useRef();
  const { camera, controls } = useThree();
  const { isInteracting, setIsInteracting, isAnimating, setIsAnimating } =
    useHero();
  const { selectedItem, setSelectedItem } = useHero();
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const isScreen = name === "leftScreen" || name === "rightScreen";

  const focusOnItem = () => {
    // If already interacting, do nothing
    if (isAnimating) return;

    console.log("focusOnItem", name, isScreen);
    setIsInteracting(true);
    setIsAnimating(true);
    controls.enabled = false;

    const itemPosition = new THREE.Vector3();
    itemRef.current.getWorldPosition(itemPosition);
    setSelectedItem({
      name: name,
      position: itemPosition,
      details: aboutMe[name],
    });


    const localOffset = new THREE.Vector3(
      viewableOffset[0],
      viewableOffset[1],
      viewableOffset[2]
    );

    const cameraTargetPosition = itemPosition.clone().add(localOffset);

    // flaoting panel for regular items
    if (!isScreen) {
      setShowInfoPanel(true);
    }

    console.log("viewableOffset", viewableOffset, cameraTargetPosition);
    const dummy = new THREE.Object3D();
    dummy.position.copy(camera.position);
    dummy.lookAt(itemPosition);

    const currentTarget = controls.target.clone();

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
      }
    );

    console.log("cameraTargetPosition", cameraTargetPosition);

    tl.to(
      ".hero-3d-layout",
      {
        duration: 0.3,
        onComplete: () => {
          // Tween camera position
          gsap.to(camera.position, {
            x: cameraTargetPosition.x,
            y: cameraTargetPosition.y,
            z: cameraTargetPosition.z,
            duration: isScreen ? 1.2 : 1,
            ease: "sine.out",
            onUpdate: () => {
              if (!isScreen) {
                camera.lookAt(itemPosition);
              } else {
                gsap.to(camera.rotation, {
                  y: dummy.rotation.y,
                  duration: 0.5,
                  ease: "sine.out",
                });
              }
            },
          });

          if (isScreen) {
            gsap.to(camera.quaternion, {});
          }

          // Tween orbit target
          gsap.to(currentTarget, {
            x: itemPosition.x,
            y: itemPosition.y,
            z: itemPosition.z,
            duration: isScreen ? 1.2 : 1,
            ease: "sine.out",
            onUpdate: () => {
              controls.target.copy(currentTarget);
              if (!isScreen) {
                controls.update();
              }
            },
            onComplete: () => {
              if (isScreen) {
                controls.minDistance = 0;
                controls.maxDistance = 10;
                controls.enablePan = false;
                controls.enableZoom = true;
              } else {
                controls.minDistance = 3;
                controls.maxDistance = 10;
                controls.enablePan = false;
                controls.enableZoom = false;
              }
              setTimeout(() => {
                console.log("setting isAnimating to false");
                setIsAnimating(false);
                controls.enabled = true; // keep deisable if going to computer
              }, 100);
              onClick?.();
            },
          });
        },
      },
      "-=0.1"
    );
  };

  const resetCamera = () => {
    // Hide info panel when resetting
    setShowInfoPanel(false);

    resetScene(
      camera,
      controls,
      roomRef,
      setIsInteracting,
      setSelectedItem,
      isAnimating,
      setIsAnimating
    );
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isInteracting && !isAnimating) {
        resetCamera();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isInteracting, isAnimating]);

  const ringRef = useRef();
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

  const handleLinkClick = (href) => {
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

      {children}

      {/* Show info panel for non-screen items */}
      {!isScreen &&
        aboutMe[name] &&
        showInfoPanel &&
        selectedItem?.name === name && (
          <FloatingInfoPanel
            content={aboutMe[name]}
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
