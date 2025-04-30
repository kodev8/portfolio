import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMedia } from "../context/MediaContext";
import GlowCard from "../components/GlowCard";
import { useLanguage } from "../context/LanguageContext";
import { experienceText } from "../constants";
gsap.registerPlugin(ScrollTrigger);

const Experience = ({ cards, type }) => {
  useGSAP(() => {
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      gsap.from(card, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
      });
    });
    ScrollTrigger.matchMedia({
      // Desktop
      "(min-width: 768px)": function () {
        gsap.utils.toArray(".timeline").forEach((timeline) => {
          ScrollTrigger.create({
            trigger: timeline,
            start: "top 60% center",
            end: "70% center",
            onUpdate: (self) => {
              gsap.set(timeline, {
                scaleY: 1 - self.progress,
                transformOrigin: "bottom bottom",
              });
            },
          });
        });
      },
    
      "(max-width: 767px)": function () {
        gsap.utils.toArray(".timeline").forEach((timeline) => {
          ScrollTrigger.create({
            trigger: timeline,
            start: "top 90%",
            end: "70% center",
            onUpdate: (self) => {
              gsap.set(timeline, {
                scaleY: 1 - self.progress,
                transformOrigin: "bottom bottom",
              });
            },
          });
        });
      },
    
      "all": function () {
      },
    });
    

    gsap.utils.toArray(".expText").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text,
          start: "top 60%",
        },
      });
    }, "<"); 
  }, []);

  const { isMobile, isLaptop } = useMedia();
  const { language } = useLanguage();
  // const colors = ["bg-red-500/50", "bg-blue-500/50", "bg-green-500/50", "bg-yellow-500/50"];
  return (
    <section className="mt-10 xl:mt-38 main-section">
      <div className="h-full w-full px-5 md:px-20">
      <div className="relative">
            {cards.map((card, index) => (
              <div key={card.title[language]} className="grid grid-cols-12 gap-4 md:gap-10">
                <div className="hidden xl:block xl:col-span-1"></div>
                <div className="order-3 col-span-full flex w-full flex-col items-end mb-10 xl:mb-0  xl:order-1 xl:col-span-4 xl:translate-x-10">
                  <GlowCard
                    card={card}
                    className="w-full max-h-32 xl:max-h-36 flex-center"
                  >
                    <img
                      src={card.logoPath}
                      alt="exp-img"
                      className="h-full object-cover"
                      style={{ transform: `scale(${ isLaptop ? card.imgScale : isMobile ? card.imgScale * 0.5 : 1})` }}
                    />
                  </GlowCard>
                </div>

                <div className="relative order-1 xl:order-2 col-span-2 flex justify-end xl:col-span-1">
                  <div className="timeline-wrapper mt-4 mx-auto">
                    <div className={`timeline bg-black`} />
                    <div className={`gradient-line h-[220%] lg:h-[250%] bg-gradient-to-b ${card.gradient}`} />
                  </div>
                  <div className="timeline-logo translate-x-5 md:translate-x-10 ">
                    <img src={card.iconPath} alt="logo" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="col-span-10 order-2 xl:col-span-5 xl-order-3 ml-4 xl:mb-10">
                  <div className="flex items-start">
                    <div className="expText relative flex gap-5 md:gap-10 xl:gap-20">
                      <div className="text-wrap">
                        <h1 className=" text-lg md:text-xl font-semibold">{card.title[language]}</h1>
                        <p className="text-white-50 text-sm md:text-base my-5">
                          🗓️&nbsp;{card.date[language]}
                        </p>
                        {
                          card.location && (
                            <p className="text-white-50 text-sm md:text-base my-5">
                              📍&nbsp;{card.location[language]}
                            </p>
                          )
                        } 
                        {
                          card.institution && (
                            <p className="text-white-50 text-sm md:text-base my-5">
                              🏛️&nbsp;{card.institution[language]}
                            </p>
                          )
                        }
  
                        <p className="italic text-[#839CB5] text-sm md:text-base">{experienceText.details[language]}</p>
                        <ul className="text-white-50 ms-5 mt-5 flex list-disc flex-col gap-5">
                          {card.details[language].map((detail, index) => (
                            <li key={index} className="text">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};

export default Experience;
