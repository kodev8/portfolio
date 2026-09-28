import React, { useRef, useEffect, lazy, Suspense } from "react";
import { words, heroWords, assetsPaths } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNav } from "../context/NavContext";
import { cn } from "../utils";
import { HighLightProvider, HighLightText } from "../components/HighlightText";
import BackArrow from "../components/ui/BackArrow";
import { useLanguage } from "../context/LanguageContext";
import { Tip } from "../components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";

// The 3D scene pulls in three, r3f, drei, rapier and postprocessing. It is
// opt-in behind the room button, so it should not be in the initial bundle.
const HeroExperience = lazy(() => import("../components/scenes/HeroExperience"));

/**
 * Warm the room chunk ahead of the click.
 *
 * Splitting it keeps ~1MB gzip out of the first paint for every visitor, but
 * on its own it just moves the wait to the moment someone opens the room.
 * Prefetching on idle, and again on hover, means the chunk is normally in the
 * module cache before it is needed — fast first paint and an instant room.
 * Repeat calls are free: the module registry dedupes them.
 */
const preloadRoom = () => {
  void import("../components/scenes/HeroExperience");
};

/**
 * Plain DOM placeholder shown while that chunk downloads.
 *
 * CanvasLoader cannot be used here: it calls drei's useProgress and renders
 * <Html>, both of which throw "Hooks can only be used within the Canvas
 * component" outside a <Canvas>. As a Suspense fallback it took the whole
 * hero down and the room rendered nothing at all.
 */
const RoomLoading = () => (
  <div className="flex h-full w-full items-center justify-center">
    <span
      role="status"
      aria-label="Loading the room"
      className="size-10 animate-spin rounded-full border-2 border-[var(--room-line)] border-t-room-accent"
    />
  </div>
);

import { motion } from "motion/react";
import { useHero } from "../context/HeroContext";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.2,
      }
    );
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useNav();
  const { language } = useLanguage();
  const { isRoomOpen, setIsRoomOpen } = useHero();
  useEffect(() => {
    registerSection("about", sectionRef);
  }, [registerSection]);

  // Fetch the 3D chunk while the browser is idle, so opening the room does
  // not start a download.
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const handle = idle(preloadRoom, { timeout: 4000 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(preloadRoom, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  // both keydown and back arrow press handled the same way
  const handleBackClick = () => {
    const escEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(escEvent);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        "main-section relative overflow-hidden",
        // The room needs a fixed canvas box. The preview card does not, and
        // pinning the closed hero to 120vh clipped the card's last lines on a
        // phone, where browser chrome eats into every vh unit.
        isRoomOpen ? "!h-[120vh]" : "!h-auto pb-20 md:!h-[120vh] md:pb-0"
      )}
    >
      {/* <div id="hero-bg" className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="background" />
      </div> */}

      {/* <div className="hero-layout"> */}
      {/* Offset below the fixed navbar with a token, not a render-time ref
          read: navBarRef.current is null on first paint, which emitted
          top:"undefinedpx", and a ref never triggers the re-render that
          would fix it. That is what let the heading sit under the nav. */}
      <div
        className={cn(
          "relative grid w-full grid-cols-5 grid-rows-[auto_1fr] pt-[calc(var(--nav-h)+1.5rem)]",
          isRoomOpen ? "h-screen" : "h-auto md:h-screen"
        )}
      >
        <span className="col-span-1 hidden xl:block"></span>
        <header
          className={cn(
            "hero-layout-header relative z-10 col-span-full mx-auto flex justify-center px-5 md:px-20 xl:col-span-3"
          )}
        >
          <div className="flex flex-col">
            <div className="hero-text">
              <h1>
                {heroWords.engineering[language]}{" "}
                <span className="slide">
                  <span className="wrapper">
                    {words[language].map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 pb-2 md:gap-3"
                      >
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          className="md:p2 size-7 rounded-full bg-white-50 p-1 md:size-10 xl:size-12"
                        />
                        <span className="text-white-50">{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <h1>{heroWords.innovativeSolutions[language]}</h1>
            </div>
            <HighLightProvider>
              <div className="md:relative">
                <p className="z-10 overflow-visible break-words whitespace-pre-wrap text-white-50 md:text-xl">
                  {heroWords.greeting[language]}{" "}
                  <HighLightText
                    text={heroWords.softwareEngineer[language]}
                    index={0}
                  />
                  {/* <br /> */} {heroWords.currently[language]}{" "}
                  <HighLightText text={heroWords.noways[language]} index={1} />{" "}
                  {heroWords.focus[language]}{" "}
                  {/* {heroWords.opportunities[language]} */}
                  {/* <br /> */}
                  <HighLightText text={heroWords.cloudandnetwork[language]} index={2} />
                  {isRoomOpen && (
                    <Tip content={heroWords.aboutMeIndicator[language]}>
                      <FaCircleInfo className="z-10 mx-2 inline-block text-white-50" />
                    </Tip>
                  )}
                </p>
              </div>
            </HighLightProvider>
          </div>
        </header>
        <span className="col-span-1 hidden xl:block"></span>

        {/* right */}

        {isRoomOpen ? (
          <figure className="col-span-full">
            <div
              className={cn(
                "hero-3d-layout col-span-full -translate-y-[45%] md:-translate-y-[25%] xl:-translate-y-[33%]"
              )}
            >
              <Suspense fallback={<RoomLoading />}>
                <HeroExperience />
              </Suspense>
            </div>
          </figure>
        ) : (
          <>
            <span className="hidden lg:block"></span>
            <div className="col-span-full flex flex-col items-center lg:col-span-3">
              <motion.div
                className="mt-8 flex w-full justify-center px-4 sm:mt-10 sm:px-0 md:mt-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setIsRoomOpen(true)}
                  onPointerEnter={preloadRoom}
                  onFocus={preloadRoom}
                  className="group relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[var(--room-line)] bg-room-surface text-left transition-[border-color,transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none sm:max-w-lg lg:max-w-2xl lg:flex-row lg:items-stretch"
                >
                  {/* A still of the room earns the click far better than a
                      paragraph describing it, and it costs 27kB rather than
                      the ~1MB the scene itself does. */}
                  <span className="relative block h-[180px] w-full shrink-0 overflow-hidden sm:h-[240px] md:h-[280px] lg:h-auto lg:w-[44%]">
                    <img
                      src={assetsPaths.images.roomPreview}
                      alt={heroWords.roomPreviewAlt[language]}
                      width={1200}
                      height={705}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full scale-[1.01] object-cover object-center transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.06]"
                    />
                    {/* Fades the photo into the card fill so the join reads as
                        one surface instead of a pasted-in thumbnail. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 lg:hidden"
                      style={{
                        backgroundImage:
                          "linear-gradient(to top, var(--color-room-surface) 0%, rgb(19 17 38 / 0.55) 40%, rgb(19 17 38 / 0) 78%)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 hidden lg:block"
                      style={{
                        backgroundImage:
                          "linear-gradient(to left, var(--color-room-surface) 0%, rgb(19 17 38 / 0.45) 35%, rgb(19 17 38 / 0) 75%)",
                      }}
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-room-accent px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-room-on-accent uppercase sm:text-[11px]">
                      {heroWords.newTab[language]}
                    </span>
                  </span>

                  <span className="flex flex-col items-start gap-3 px-5 pt-5 pb-6 sm:gap-4 sm:px-7 sm:pt-6 sm:pb-7 lg:justify-center lg:py-8 lg:pl-0">
                    <span className="text-xl leading-snug font-bold text-room-hi md:text-2xl">
                      {heroWords.wantToKnowMore[language]}
                    </span>

                    <span className="max-w-sm text-sm leading-relaxed text-room-mid sm:text-base">
                      {heroWords.clickToExplore[language]}
                    </span>

                    <span className="mt-1 inline-flex h-11 items-center gap-2 rounded-xl bg-room-accent px-5 text-sm font-semibold text-room-on-accent transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:translate-x-0.5 sm:text-base">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m9 6 8 6-8 6z" />
                      </svg>
                      {heroWords.enterMyRoom[language]}
                    </span>
                  </span>
                </button>
              </motion.div>
            </div>

            <span className="hidden lg:block"></span>
          </>
        )}
      </div>
      {/* Add the back arrow */}
      <BackArrow onClick={handleBackClick} />
    </section>
  );
};

export default Hero;
