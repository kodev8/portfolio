import { useRef, useEffect, useState, useCallback, memo, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useThree, Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useNav } from "../context/NavContext";
import TitleHeader from "../components/TitleHeader";
import TechIcon from "../components/TechIcon";
import GlowCard from "../components/GlowCard";
import { techStackGroups } from "../constants";
import { useMedia } from "../context/MediaContext";
import { div } from "motion/react-client";

const Boundaries = memo(() => {
  const { viewport } = useThree();
  const margin = 0.3;
  const width = viewport.width - margin * 2;
  const height = viewport.height - margin * 2;
  const thickness = 0.2;

  return (
    <>
      {/* top */}
      <RigidBody type="fixed" position={[0, height / 2 + thickness / 2, 0]}>
        <CuboidCollider args={[width / 2 + thickness, thickness / 2, 1]} />
      </RigidBody>

      {/* bottom */}
      <RigidBody type="fixed" position={[0, -height / 2 - thickness / 2, 0]}>
        <CuboidCollider args={[width / 2 + thickness, thickness / 2, 1]} />
      </RigidBody>

      {/* left */}
      <RigidBody type="fixed" position={[-width / 2 - thickness / 2, 0, 0]}>
        <CuboidCollider args={[thickness / 2, height / 2 + thickness, 1]} />
      </RigidBody>

      {/* right */}
      <RigidBody type="fixed" position={[width / 2 + thickness / 2, 0, 0]}>
        <CuboidCollider args={[thickness / 2, height / 2 + thickness, 1]} />
      </RigidBody>
    </>
  );
});

const BoundsBox = memo(() => {
  const { viewport } = useThree();
  const margin = 0.3;
  const width = viewport.width - margin * 2;
  const height = viewport.height - margin * 2;

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="white" wireframe opacity={0.5} transparent />
    </mesh>
  );
});

const TechCanvas = memo(({ group, resetTrigger }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ViewportProvider>
        {(sizedData) => (
          <>
            <ambientLight intensity={2} />
            <Environment preset="city" />
            <Physics
              gravity={[0, 0, 0]}
              interpolate={false}
              timeStep={1 / 60}
              maxStabilizationIterations={5}
            >
              <Boundaries />
              <IconGrid
                icons={group.icons}
                resetTrigger={resetTrigger}
                sizedData={sizedData}
              />
            </Physics>
            {/* <BoundsBox /> */}
          </>
        )}
      </ViewportProvider>
    </Canvas>
  );
});

const IconGrid = memo(({ icons, resetTrigger, sizedData }) => {
  const { isMobile } = useMedia();
  let columns, rows;
  const { viewport } = sizedData;

  if (isMobile) {
    columns = 2;
    rows = Math.ceil(icons.length / columns);

    if (rows > 4 && icons.length > 4) {
      columns = 3;
      rows = Math.ceil(icons.length / columns);
    }
  } else {
    columns = Math.min(5, icons.length);
    rows = Math.ceil(icons.length / columns);
  }

  const baseSpacing = isMobile ? 1.2 : 3;
  const spacingX = baseSpacing * (viewport.width / (isMobile ? 3 : 20));
  const spacingY = baseSpacing * (viewport.height / (isMobile ? 6 : 15));

  const offsetX = ((columns - 1) * spacingX) / 2;
  const offsetY = ((rows - 1) * spacingY) / 2;
  return (
    <group>
    {icons.map((icon, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const x = col * spacingX - offsetX + (icon.xOffset || 0);
      const y = -row * spacingY + offsetY + (icon.yOffset || 0);

      return (
        <TechIcon
          key={index}
          model={icon}
          position={[x, y, 0]}
          resetTrigger={resetTrigger}
          initialPosition={[x, y, 0]}
          sizedData={sizedData} 
        />
      );
    })}
  </group>
  );
});


// created this to stop rerender when scrolling 
// since getting the viewport size was causing rerenders 
const ViewportProvider = ({ children }) => {
  const { viewport, size } = useThree();
  const viewPortData = useMemo(
    () => ({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      size: {
        width: size.width,
        height: size.height,
      },
    }),
    [viewport.width, viewport.height, size.width, size.height]
  );
  return children(viewPortData);
};
const TechStack = () => {
  const { registerSection } = useNav();
  const sectionRef = useRef(null);

  const [resetTrigger, setResetTrigger] = useState(true);

  useEffect(() => {
    registerSection("skills", sectionRef);
  }, [registerSection]);

  useGSAP(() => {
    gsap.fromTo(
      ".tech-card",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#skills",
          start: "top center",
        },
      }
    );
  });

  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };

    const canvases = document.querySelectorAll("#skills canvas");

    canvases.forEach((canvas) => {
      canvas.addEventListener("touchstart", preventScroll, { passive: false });
      canvas.addEventListener("touchmove", preventScroll, { passive: false });
      canvas.addEventListener("touchend", preventScroll, { passive: false });
    });

    return () => {
      canvases.forEach((canvas) => {
        canvas.removeEventListener("touchstart", preventScroll);
        canvas.removeEventListener("touchmove", preventScroll);
        canvas.removeEventListener("touchend", preventScroll);
      });
    };
  }, []);

  const handleReset = useCallback(() => {
    setResetTrigger((prev) => !prev);
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="flex-center section-padding snap-item"
    >
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="Tech Stack" sub="🤝 What I Bring to the Table" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mx-8 md:mx-16 lg:mx-24">
          {/* reset */}
          <div className="flex justify-center mt-4 lg:col-span-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md 
                        transition-colors duration-300 flex items-center gap-2 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Reset Icons
            </button>
          </div>

          {/* instruction text */}
          <div className="md:hidden text-center text-white-50 text-sm lg:col-span-2 -mt-2 mb-2">
            Tap and drag icons to interact with them
          </div>

          {techStackGroups.map((group, index) => (
            // for staggering the cards
            <div
              key={index}
              className={`tech-card h-full w-full ${
                index === 1
                  ? "lg:mt-16"
                  : index % 2 === 1
                  ? "lg:mt-4"
                  : index > 1
                  ? "lg:-mt-16"
                  : ""
              }`}
            >
              <GlowCard card={group} className="group w-full h-[40vh]">
                <h3 className="text-white-50 font-semibold text-xl group-hover:text-purple-500 transition-all duration-300">
                  {group.name}
                </h3>
                <div className="h-full w-full">
                  <TechCanvas group={group} resetTrigger={resetTrigger} />
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
