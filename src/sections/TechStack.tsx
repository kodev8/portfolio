import {
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNav } from "../context/NavContext";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

/** Loaded only when a visitor switches the section into 3D. */
const TechCanvas = lazy(() => import("../components/scenes/TechCanvas"));

/** Warm the chunk on intent so flipping to 3D is not a download. */
const preloadTechCanvas = () => {
  void import("../components/scenes/TechCanvas");
};

const TechCanvasFallback = () => (
  <div className="flex-center h-full w-full">
    <Spinner className="h-10 w-10 text-room-accent" />
  </div>
);
import { techStackGroups, techStackHeader, techStackText } from "../constants";
import { useLanguage } from "../context/LanguageContext";
import { Tip } from "../components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { cn } from "../utils";
import { Spinner } from "../components/ui/spinner";
import type { TechStackGroup } from "../types";


const TechList2d = memo(({ group }: { group: TechStackGroup }) => {
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

const TechStack = () => {
  const { registerSection } = useNav();
  const sectionRef = useRef<HTMLElement | null>(null);
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
    const preventScroll = (e: Event) => {
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
      <div className="w-full h-full md:px-10 sm:px-4">
        <TitleHeader
          index="04"
          title={techStackHeader.title[language]}
          sub={techStackHeader.sub[language]}
          tipContent={is3d ? techStackHeader.tip![language] : null}
        >
          <div className="mb-4 flex flex-col items-center justify-center gap-3">
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
              onPointerEnter={preloadTechCanvas}
            >
              <span
                className={cn(
                  "relative block h-[22px] w-[38px] rounded-full transition-colors",
                  "duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                  is3d ? "bg-room-accent" : "bg-[var(--room-line-strong)]"
                )}
              >
                <span
                  className={cn(
                    "absolute top-[3px] block size-4 rounded-full transition-all",
                    "duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                    is3d ? "right-[3px] bg-room-on-accent" : "left-[3px] bg-room-mid"
                  )}
                />
              </span>
              <span className="type-label text-room-mid">
                {is3d ? (
                  <span className="text-room-accent flex items-center gap-1">
                    3D
                    <Tip content={techStackText.tip3d[language]}>
                      <FaInfoCircle className="w-4 h-4" />
                    </Tip>
                  </span>
                ) : (
                  <span className="text-room-mid">2D</span>
                )}
              </span>
            </label>

            {is3d && (
              <Button
                onClick={handleReset}
                className="px-4 py-2 bg-room-accent hover:brightness-110 text-room-on-accent rounded-xl font-semibold
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

        </TitleHeader>

        <div className="mx-8 mt-8 grid grid-cols-1 items-start gap-8 md:mx-16 lg:mx-24 lg:grid-cols-2">
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
                <h3 className="text-white-50 mb-4 font-semibold text-lg md:text-xl group-hover:text-room-accent transition-all duration-300">
                  {group.name[language]}
                </h3>
                {is3d ? (
                  <div className="h-[40vh] w-full">
                    <Suspense fallback={<TechCanvasFallback />}>
                    <TechCanvas
                      group={group}
                      resetTrigger={resetTrigger}
                      is3d={is3d}
                    />
                    </Suspense>
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
