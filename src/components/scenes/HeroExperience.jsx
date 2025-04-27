import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Rubik } from "../models/Rubik";
import { Pikachu } from "../models/Pikachu";
import { Spiderman } from "../models/Spiderman";
import { Cleats } from "../models/Cleats";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { Suspense } from "react";
import Clickable from "../models/Clickable";
import { Football } from "../models/Football";
import { Ttflag } from "../models/Ttflag";
import { Text3D } from "@react-three/drei";
import { useMedia } from "../../context/MediaContext";
import { useHero } from "../../context/HeroContext";
import { Bedroom } from "../models/Bedroom";
import { Dumbbell } from "../models/Dumbbell";
import {
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import CanvasLoader from "./CanvasLoader";
import { itemData } from "../../constants/scenePositions";
import DesktopScreen from "./DesktopScreen";
// import { resolveZoom } from "../../utils/scene";
// import { useMemo } from "react";
// import { useHelper } from "@react-three/drei";
// import * as THREE from "three";

const MOBILE_SCALE = 0.5;
export const ORIGINAL_CAMERA_POSITION = [0, 0, 15];

const SceneContent = () => {
  const { isMobile } = useMedia();
  const {
    isInteracting,
  } = useHero();
  const roomRef = useRef();
  const dumbbellRef = useRef();
  const dumbbellLightRef = useRef();
  // useHelper(dumbbellLightRef, THREE.SpotLightHelper, 0.5, "white")

  useEffect(() => {
    if (dumbbellRef.current && dumbbellLightRef.current) {
      dumbbellLightRef.current.target = dumbbellRef.current;
    } 
  }, [dumbbellRef.current, dumbbellLightRef.current]);

  // const { maxDistance, minDistance } = useMemo(() => resolveZoom({ isInteracting, isMobile }), [isInteracting, isMobile]);
  

  return (
    <>
      {/* deep blue ambient */}
      <ambientLight intensity={2} color="#332294" />
      <EffectComposer>
        <Bloom intensity={0.2} threshold={0.5} radius={0.5} />
      </EffectComposer>
      <OrbitControls
        makeDefault
        enabled={!isMobile}
        enablePan={false}
        enableZoom={!isMobile}
        maxDistance={isInteracting ? 20 : 14}
        minDistance={isInteracting ? 3 : 10}
        minPolarAngle={isInteracting ? 0 : Math.PI / 5}
        maxPolarAngle={isInteracting ? Math.PI : Math.PI / 2}
        maxAzimuthAngle={isInteracting ? Math.PI / 2 : Math.PI / 4}
        minAzimuthAngle={isInteracting ? -Math.PI / 2 : -Math.PI / 4}
      />

        <HeroLights />
        <spotLight
          ref={dumbbellLightRef}
          angle={0.2}
          penumbra={0.2}
          position={[2, 10, -1]}
          intensity={50}
          color="white"
          />
        <Particles count={50} />
        <group
          ref={roomRef}
          scale={isMobile ? MOBILE_SCALE : 1}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          {/* <Room /> */}
          <Bedroom scale={0.04} />

          {/* Rubik */}
          <Clickable {...itemData.rubik.clickableProps}>
            <Rubik {...itemData.rubik.itemProps} />
          </Clickable>

          {/* Spiderman */}
          <Clickable {...itemData.spiderman}>
            <Spiderman scale={itemData.spiderman.scale}></Spiderman>
          </Clickable>

          {/* Cleats */}
          <Clickable {...itemData.cleatsGroup}>
            <Cleats {...itemData.cleat1} />
            <Cleats {...itemData.cleat2} />
            <Football {...itemData.football} />
          </Clickable>

          {/* TT Flag */}
          <Clickable {...itemData.ttflag}>
            <Ttflag scale={itemData.ttflag.scale} />
          </Clickable>

          <Text3D
            letterSpacing={-0.05}
            font="/fonts/Mona Sans ExtraLight_Regular.json"
            {...itemData.text}
          >
            PURPOSE
            <meshNormalMaterial color="white" />
          </Text3D>

          {/* Pikachu */}
          <Clickable {...itemData.pikachu.clickableProps}>
            <Pikachu {...itemData.pikachu.itemProps} />
          </Clickable>

          {/* left screen */}
          <Clickable
            withRing={false}
          roomRef={roomRef}
          name="leftScreen"
          {...itemData.leftScreen}
          >
            <DesktopScreen   width={2} height={1.2} />
          </Clickable>

        
          <Clickable roomRef={roomRef} {...itemData.dumbbellGroup}>
            <Dumbbell {...itemData.dumbbell1} />
            <Dumbbell ref={dumbbellRef} {...itemData.dumbbell2} />
          </Clickable>
        </group>
    </>
  );
};

const HeroExperience = () => {
  return (
    <Canvas
      // onClick={() => alert("if you want to learn more about me, please try a bigger screen")}
      camera={{ position: ORIGINAL_CAMERA_POSITION, fov: 45 }}
      className="hero-canvas h-1/2"
    >
      <Suspense fallback={<CanvasLoader />}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
