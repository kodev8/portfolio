import { Float, useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useState, memo } from "react";
import { useDrag } from "@use-gesture/react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useMedia } from "../context/MediaContext";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const TechIcon = memo(({ model, position: initialPosition, resetTrigger, sizedData }) => {
  const { isMobile } = useMedia();
  const { viewport, size, is3d } = sizedData;
  const groupRef = useRef();
  const rigidBodyRef = useRef();
  const positionRef = useRef(new THREE.Vector3(...initialPosition));
  const rotationRef = useRef(new THREE.Euler());
  const scene = useGLTF(model.modelPath);
  const [isDragging, setIsDragging] = useState(false);

  const xMargin = isMobile ? 0.2 : 0.5;
  const yMargin = isMobile ? 0.3 : 1.5;
  const viewWidth = viewport.width;
  const viewHeight = viewport.height;

  const minX = -viewWidth / 2 + xMargin;
  const maxX = viewWidth / 2 - xMargin;
  const minY = -viewHeight / 2 + yMargin;
  const maxY = viewHeight / 2 - yMargin;

  useEffect(() => {
    if (model.name === "Three.js") {
      scene.scene.traverse((child) => {
        if (child.isMesh && child.name === "Object_5") {
          child.material = new THREE.MeshStandardMaterial({ color: "white" });
        }
      });
    }

    // reset the icon to the initial position
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation(
        { x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] },
        true
      );
      rigidBodyRef.current.setRotation(
        new THREE.Quaternion().setFromEuler(new THREE.Euler()),
        true
      );

      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      positionRef.current.set(...initialPosition);
      rotationRef.current.set(0, 0, 0);
    }
  }, [model.name, initialPosition, resetTrigger, is3d]);

  const bind = useDrag(
    ({ delta: [dx, dy], event, down, first }) => {
      if (!rigidBodyRef.current) return;

      // prevent default behavior for touch events to avoid scrolling
      if (event.type.includes("touch") && first) {
        event.preventDefault();
        event.stopPropagation();
      }

      setIsDragging(down);

      if (down) {
        rigidBodyRef.current.setBodyType(2);

        if (event.shiftKey) {
          rotationRef.current.y += dx * 0.01;
          rotationRef.current.x += dy * 0.01;
          rigidBodyRef.current.setRotation(
            new THREE.Quaternion().setFromEuler(rotationRef.current),
            true
          );
        } else {
          // scaled deltas
          const scaleFactor = event.type.includes("touch") ? 1.2 : 1;
          const deltaX = (dx / size.width) * viewport.width * scaleFactor;
          const deltaY = (dy / size.height) * viewport.height * scaleFactor;

          positionRef.current.x = clamp(
            positionRef.current.x + deltaX,
            minX,
            maxX
          );
          positionRef.current.y = clamp(
            positionRef.current.y - deltaY,
            minY,
            maxY
          );

          rigidBodyRef.current.setTranslation(
            {
              x: positionRef.current.x,
              y: positionRef.current.y,
              z: positionRef.current.z,
            },
            true
          );
        }
      } else {
        rigidBodyRef.current.setBodyType(1);
        const impulseFactor = isMobile ? 0.00005 : 0.0001;
        rigidBodyRef.current.applyImpulse(
          { x: dx * impulseFactor, y: -dy * impulseFactor, z: 0 },
          true
        );
      }
    },
    {
      pointerEvents: true,
      eventOptions: { passive: false },
    }
  );

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      linearDamping={isMobile ? 5 : 3}
      angularDamping={isMobile ? 3 : 1}
      position={initialPosition}
      type={isDragging ? "kinematic" : "dynamic"}
      restitution={isMobile ? 1 : 2}
      friction={0}
    >
      <group
        ref={groupRef}
        {...bind()}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <CuboidCollider
          args={[isMobile ? 0.4 : 1, isMobile ? 0.4 : 1, isMobile ? 0.4 : 1]}
          sensor={false}
        />

        <Float
          speed={5.5}
          rotationIntensity={isDragging ? 0 : isMobile ? 0.2 : 0.5}
          floatIntensity={isDragging ? 0 : isMobile ? 0.3 : 0.9}
        >
          <group
            scale={model.scale * (viewport.width / 100) * 8}
            rotation={model.rotation}
          >
            <primitive object={scene.scene} />
          </group>

          <Text
            fontSize={(viewport.width / 100) * 3}
            fontWeight={900}
            color="white"
            position={
              model.textPosition ?? [
                0,
                -0.6 * (viewport.width / 100) * 7,
                0,
              ]
            }
            anchorX="center"
            anchorY="top"
          >
            {model.name}
          </Text>
        </Float>
      </group>
    </RigidBody>
  );
});

export default TechIcon;
