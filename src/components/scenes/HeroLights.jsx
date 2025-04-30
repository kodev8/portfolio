import * as THREE from "three";
import { useRef } from "react";
import { useHelper } from "@react-three/drei"


const HeroLights = () => {


  const light1 = useRef()
  useHelper(light1, THREE.DirectionalLightHelper, 0.5, "white")

  const light2 = useRef()
  // useHelper(light2, PointLightHelper, 0.5, "white")

  return (
    <>
      {/* <spotLight
        ref={light1}
        position={[2, 5, 6]}
        angle={0.15}
        penumbra={0.2}
        intensity={100}
        color="white"
      />

      <spotLight
        position={[4, 5, 4]}
        angle={0.3}
        penumbra={0.5}
        intensity={40}
        color="#4cc9f0"
      />

      <spotLight
        position={[-3, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={60}
        color="#9d4edd"
      /> */}

{/* <spotLight
        position={[-8, 10, 1]}
        angle={0.1}
        penumbra={0.2}
        intensity={100}
        color="white"
        ref={light1}
      /> */}
      {/* position: [2, 0.2, -1], */}
      {/* <directionalLight
        position={[2, 0.2, -1]}
        target={[2, -0.2, -1]}
        penumbra={0.2}
        intensity={10}
        color="white"
        ref={light1}
      /> */}
{/*  */}
      <primitive
        object={new THREE.RectAreaLight("#dbd5f0", 8, 3, 2)}
        position={[1, 3, 4]}
        intensity={13}
        rotation={[-Math.PI / 4, Math.PI / 4, 0]}
      />

      <pointLight ref={light2} position={[-3, 1, 2]} intensity={5} color="#7209b7" />
      {/* <pointLight  position={[1, 2, -2]} intensity={10} color="#0D00A4" /> */}
    </>
  );
};

export default HeroLights;
