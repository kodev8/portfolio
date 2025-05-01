import {
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
  useMemo,
  Suspense,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useThree, Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useNav } from "../context/NavContext";
import TitleHeader from "../components/TitleHeader";
import TechIcon from "../components/TechIcon";
import GlowCard from "../components/GlowCard";
import { techStackGroups, techStackHeader, techStackText } from "../constants";
import { useMedia } from "../context/MediaContext";
import { useLanguage } from "../context/LanguageContext";
import { Tip } from "../components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { cn } from "../utils";
import { Spinner } from "../components/ui/spinner";

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

const TechCanvasFallback = () => {
  return (
    <div className="flex-center w-full h-full">
      <Spinner className="w-10 h-10 text-purple-500" />
    </div>
  );
};

const TechCanvas = memo(({ group, resetTrigger, is3d }) => {
  return (
    <Suspense fallback={<TechCanvasFallback />}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ViewportProvider is3d={is3d}>
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
    </Suspense>
  );
});

const IconGrid = memo(({ icons, resetTrigger, sizedData }) => {
  const { viewport } = sizedData;

  // greedy algorithm to get the best fit for the icons
  const getBestFit = (icons) => {
    let bestFit = { columns: 1, rows: 1 };
    let bestScore = Infinity;

    for (let columns = 2; columns <= 5; columns++) {
      const rows = Math.ceil(icons.length / columns);
      const itemWidth = viewport.width / columns;
      const itemHeight = viewport.height / rows;
      const aspectRatio = itemWidth / itemHeight;
      const idealAspectRatio = 1;
      const score = Math.abs(aspectRatio - idealAspectRatio);
      if (score < bestScore) {
        bestFit = { columns, rows, itemWidth, itemHeight };
        bestScore = score;
      }
    }
    return bestFit;
  };

  const { columns, rows, itemWidth, itemHeight } = getBestFit(icons);
  const spacingX = itemWidth;
  const spacingY = itemHeight;

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

const TechList2d = memo(({ group }) => {
  return (
    <div className="grid grid-cols-2 md:flex flex-wrap gap-x-16 gap-y-4 items-center justify-start lg:my-auto">
      {group.icons.map((icon) => (
        <div key={icon.name} className="flex flex-col items-center justify-center">
          <img
            src={icon.imgPath}
            alt={icon.name}
            className="max-h-16 aspect-auto rounded-md"
          />
          <h3 className="text-white-50 font-semibold text-sm md:text-base text-center">
            {icon.name}
          </h3>
        </div>
      ))}
    </div>
  );
});

// created this to stop rerender when scrolling
// since getting the viewport size was causing rerenders
const ViewportProvider = ({ is3d, children }) => {
  const { viewport, size } = useThree();
  const viewPortData = useMemo(() => {
    // console.log("in vp is3d", is3d, "viewport.width", viewport.width, "viewport.height", viewport.height, "size.width", size.width, "size.height", size.height);
    return {
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      size: {
        width: size.width,
        height: size.height,
      },
      is3d: is3d,
    };
  }, [viewport.width, viewport.height, size.width, size.height, is3d]);
  return children(viewPortData);
};
const TechStack = () => {
  const { registerSection } = useNav();
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  const [resetTrigger, setResetTrigger] = useState(true);
  const [is3d, setIs3d] = useState(false);

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

    if (is3d) {
      const canvases = document.querySelectorAll("#skills canvas");

      canvases.forEach((canvas) => {
        canvas.addEventListener("touchstart", preventScroll, {
          passive: false,
        });
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
    }
  }, [is3d]);

  const handleReset = useCallback(() => {
    setResetTrigger((prev) => !prev);
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="flex-center section-padding snap-item main-section"
    >
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title={techStackHeader.title[language]}
          sub={techStackHeader.sub[language]}
          tipContent={is3d ? techStackHeader.tip[language] : null}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mx-8 md:mx-16 lg:mx-24">
          {/* reset */}
          <div className="flex flex-col-center lg:mt-32 lg:col-span-2 gap-2">
            <input
              type="checkbox"
              id="toggle3d"
              className="hidden"
              onChange={() => setIs3d(!is3d)}
              checked={is3d}
            />
            <label
              htmlFor="toggle3d"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span
                className={cn(
                  "w-6 h-6 border-2 border-purple-600 rounded-full",
                  is3d ? "bg-purple-600" : "bg-white-50"
                )}
              ></span>
              <span className="text-white-50 font-semibold text-sm md:text-xl group-hover:text-purple-500 transition-all duration-300">
                {is3d ? (
                  <span className="text-purple-500 flex items-center gap-1">
                    3D
                    <Tip content={techStackText.tip3d[language]}>
                      <FaInfoCircle className="w-4 h-4" />
                    </Tip>
                  </span>
                ) : (
                  <span className="!text-white-50">2D</span>
                )}
              </span>
            </label>

            {is3d && (
              <Button
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
                {techStackText.reset[language]}
              </Button>
            )}
          </div>

          {/* instruction text */}
          {is3d && (
            <div className="md:hidden text-center text-white-50 text-sm lg:col-span-2 -mt-2 mb-2">
              {techStackText.tapAndDrag[language]}
            </div>
          )}

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
              <GlowCard
                card={group}
                className="group w-full"
              >
                <h3 className="text-white-50 mb-4 font-semibold text-lg md:text-xl group-hover:text-purple-500 transition-all duration-300">
                  {group.name[language]}
                </h3>
                {is3d ? (
                  <div className="h-[40vh] w-full">
                    <TechCanvas
                      group={group}
                      resetTrigger={resetTrigger}
                      is3d={is3d}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full flex">
                    <TechList2d group={group} />
                  </div>
                )}
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
