import React, { useRef, useEffect } from "react";
import { words, heroWords } from "../constants";
import HeroExperience from "../components/scenes/HeroExperience";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNav } from "../context/NavContext";
import { cn } from "../utils";
import { HighLightProvider, HighLightText } from "../components/HighlightText";
import BackArrow from "../components/ui/BackArrow";
import { useMedia } from "../context/MediaContext";
import { useLanguage } from "../context/LanguageContext";
import { Tip } from "../components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { motion } from "framer-motion";
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

  const sectionRef = useRef(null);
  const { registerSection, navBarRef } = useNav();
  const { isMobile } = useMedia();
  const { language } = useLanguage();
  const { isRoomOpen, setIsRoomOpen } = useHero();
  useEffect(() => {
    registerSection("about", sectionRef);
  }, [registerSection]);

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
      className="relative overflow-hidden main-section !h-[120vh]"
    >
      {/* <div id="hero-bg" className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="background" />
      </div> */}

      {/* <div className="hero-layout"> */}
      <div
        className="relative w-full h-screen grid-rows-[auto_1fr]  grid grid-cols-5 "
        style={{
          top: `${navBarRef.current?.offsetHeight}px`,
        }}
      >
        <span className="hidden xl:block col-span-1"></span>
        <header
          className={cn(
            "hero-layout-header col-span-full xl:col-span-3 flex justify-center relative md:px-20 px-5 z-10 mx-auto"
          )}
        >
          <div className="flex flex-col  ">
            <div className="hero-text">
              <h1>
                {heroWords.engineering[language]}{" "}
                <span className="slide">
                  <span className="wrapper">
                    {words[language].map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center md:gap-3 gap-1 pb-2"
                      >
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          className="xl:size-12 md:size-10 size-7 md:p2 p-1 rounded-full bg-white-50"
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
                <p className="text-white-50 md:text-xl overflow-visible z-10 break-words whitespace-pre-wrap">
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
                  <HighLightText
                    text={heroWords.cloudandnetwork[language]}
                    index={2}
                  />

                  {isRoomOpen && (
                    <Tip content={heroWords.aboutMeIndicator[language]}>
                      <FaCircleInfo className="text-white-50 inline-block mx-2 z-10" />
                    </Tip>
                  )}
                </p>
              </div>
            </HighLightProvider>
          </div>
        </header>
        <span className="hidden xl:block col-span-1"></span>

        {/* right */}

        {isRoomOpen ? (
          <figure className="col-span-full">
            <div
              className={cn(
                "hero-3d-layout col-span-full -translate-y-[45%] md:-translate-y-[25%] xl:-translate-y-[33%]"
              )}
            >
              <HeroExperience />
            </div>
          </figure>
        ) : (
          <>
            <span className=""></span>
            <div className="col-span-3 flex flex-col items-center">
              <motion.div
                className="mt-10 sm:mt-16 md:mt-20 flex justify-center px-4 sm:px-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setIsRoomOpen(true)}
                  className="group relative flex flex-col items-center w-full max-w-md sm:max-w-lg px-6 sm:px-8 py-8 sm:py-10 bg-zinc-900 border border-zinc-700 rounded-3xl shadow-lg hover:shadow-xl hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-xl md:text-2xl font-bold text-white group-hover:scale-105 transition-transform text-center leading-snug">
                    {heroWords.wantToKnowMore[language]}
                  </div>
                  <p className="text-sm sm:text-base text-zinc-400 mt-3 sm:mt-4 group-hover:text-zinc-300 transition-colors text-center max-w-sm">
                    {heroWords.clickToExplore[language]}
                  </p>
                  <span className="mt-6 px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-black rounded-full font-medium group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 text-sm sm:text-base">
                    {heroWords.enterMyRoom[language]}
                  </span>
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-sky-600 text-[10px] sm:text-xs text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
                    {heroWords.newTab[language]}
                  </div>
                </button>
              </motion.div>
            </div>

            <span className=""></span>
          </>
        )}
      </div>
      {/* Add the back arrow */}
      <BackArrow onClick={handleBackClick} />
    </section>
  );
};

export default Hero;
