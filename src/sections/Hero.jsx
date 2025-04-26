import React, { useRef, useEffect } from "react";
import { words } from "../constants";
import HeroExperience from "../components/scenes/HeroExperience";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNav } from "../context/NavContext";
import { cn } from "../utils";
import { HighLightProvider, HighLightText } from "../components/HighlightText";
import BackArrow from "../components/ui/BackArrow";

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
  const { registerSection } = useNav();

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
      className="relative overflow-hidden pb"
    >
      <div id="hero-bg" className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="background" />
      </div>

      {/* <div className="hero-layout"> */}
      <div className="flex flex-col relative top-[104px] w-full h-screen">
        {/* left */}
        <header
          className={cn(
            "hero-layout-header flex justify-center relative w-screen md:px-20 px-5 z-10",
            {
              // "!opacity-0 transition-all duration-500": isInteracting,
            }
          )}
        >
          <div className="flex flex-col">
            <div className="hero-text">
              <h1>
                Engineering{" "}
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
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
              <h1>into Innovative Solutions</h1>
            </div>
            <HighLightProvider>
              <div className="relative">
              <p className="text-white-50 md:text-xl overflow-visible z-10 ">
                Hi, I'm Kalev —{" "}
                <HighLightText
                  text="a full-stack developer based in Paris, France"
                  index={0}
                />
                <br />
                I'm currently{" "}
                <HighLightText
                  text="looking for a full-time internship"
                  index={1}
                />{" "}
                where I can <br />
                apply my skills, learn, and contribute to real-world projects.
               
              </p>
              <a
                  href="#projects"
                  className="rounded-full absolute flex items-center gap-2 bottom-0 left-[95%] bg-white-50 hover:bg-black-200 hover:text-white-50 size-10 group transition-all duration-500 !origin-center overflow-visible hover:w-48"
                >
                  
                  <div className="ml-auto mr-2 group-hover:size-8 group-hover:bg-white-50 rounded-full size-6 flex-center transition-all duration-500">
                    <img
                      className="animate-bounce"
                      src="/images/arrow-down.svg"
                      alt="arrow"
                    />

                  </div>
                  <span className="absolute font-semibold left-4 text-black-200 mx-auto text-sm whitespace-nowrap hidden group-hover:block group-hover:text-white-50 transition-opacity duration-300">
                    View my projects
                  </span>
                </a>
                </div>
            </HighLightProvider>
          
          </div>
        </header>

        {/* right */}
        <figure className="z-1 ">
          <div
            className={cn(
              "hero-3d-layout -translate-y-[45%] md:-translate-y-[25%] xl:-translate-y-[33%]",
              {
                // "!w-full": isInteracting,
              }
            )}
          >
            <HeroExperience />
          </div>
        </figure>
      </div>
      {/* Add the back arrow */}
      <BackArrow onClick={handleBackClick} />
    </section>
  );
};

export default Hero;
