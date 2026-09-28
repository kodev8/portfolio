import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowCard from "../components/GlowCard";
import { useLanguage } from "../context/LanguageContext";
import { experienceText } from "../constants";
import type { ReactNode } from "react";
import type { ExperienceCard } from "../types";
gsap.registerPlugin(ScrollTrigger);

/** Stroke icon for a metadata row. Replaces the emoji this section used. */
const MetaIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-room-low"
    aria-hidden="true"
  >
    {children}
  </svg>
);

interface ExperienceProps {
  cards: ExperienceCard[];
  type: string;
}

const Experience = ({ cards }: ExperienceProps) => {
  useGSAP(() => {
    gsap.utils.toArray<Element>(".timeline-card").forEach((card) => {
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
    // Draw the rail itself rather than scaling a ground-coloured mask off it.
    // The mask approach left the line hidden whenever its trigger had not
    // updated, which is why the timeline kept vanishing at some widths.
    gsap.utils.toArray<Element>(".gradient-line").forEach((line) => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top top",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
    });

    gsap.utils.toArray<Element>(".expText").forEach((text) => {
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

  const { language } = useLanguage();
  // const colors = ["bg-red-500/50", "bg-blue-500/50", "bg-green-500/50", "bg-yellow-500/50"];
  return (
    <section className="main-section mt-10 xl:mt-38">
      <div className="h-full w-full px-5 md:px-20">
        <div className="relative">
          {cards.map((card) => (
            <div
              key={card.title[language]}
              className="grid grid-cols-12 gap-4 md:gap-10"
            >
              <div className="hidden xl:col-span-1 xl:block"></div>
              <div className="order-3 col-span-full mb-10 flex w-full flex-col items-end xl:order-1 xl:col-span-4 xl:mb-0 xl:translate-x-10">
                {/* One fixed tile at a shared size for every logo. The old
                      per-card imgScale rendered Noways tiny inside a white box
                      while Cavitry filled its card edge to edge. */}
                <GlowCard card={card} className="flex-center h-28 w-full xl:h-32">
                  <img
                    src={card.logoPath}
                    alt={`${card.title[language]} logo`}
                    className="max-h-[68%] max-w-[72%] object-contain"
                  />
                </GlowCard>
              </div>

              <div className="relative order-1 col-span-2 flex justify-end xl:order-2 xl:col-span-1">
                <div className="timeline-wrapper mx-auto mt-4">
                  {/* The rail colour used to come from card.gradient, a
                        Tailwind class string held in data. Tailwind cannot see
                        runtime-assembled classes, so it purged whichever ones
                        no other file happened to use and those rails rendered
                        invisible. It is a token gradient now. */}
                  <div className="gradient-line h-[220%] lg:h-[250%]" />
                </div>
                <div className="timeline-logo translate-x-5 md:translate-x-10">
                  <img
                    src={card.iconPath}
                    alt="logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="xl-order-3 order-2 col-span-10 ml-4 xl:col-span-5 xl:mb-10">
                <div className="flex items-start">
                  <div className="expText relative flex gap-5 md:gap-10 xl:gap-20">
                    <div className="text-wrap">
                      <h3 className="type-h3">{card.title[language]}</h3>

                      <p className="mt-3 font-mono text-[11px] tracking-[0.06em] text-room-accent uppercase">
                        {card.date[language]}
                      </p>

                      <div className="mt-3 flex flex-col gap-2">
                        {card.location && (
                          <p className="flex items-center gap-2 text-sm text-room-mid md:text-base">
                            <MetaIcon>
                              <path d="M12 21s-7-4.6-7-10a7 7 0 0 1 14 0c0 5.4-7 10-7 10z" />
                              <circle cx="12" cy="11" r="2.4" />
                            </MetaIcon>
                            {card.location[language]}
                          </p>
                        )}
                        {card.institution && (
                          <p className="flex items-center gap-2 text-sm text-room-mid md:text-base">
                            <MetaIcon>
                              <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />
                            </MetaIcon>
                            {card.institution[language]}
                          </p>
                        )}
                      </div>

                      <p className="mt-5 font-mono text-[11px] tracking-[0.08em] text-room-low uppercase">
                        {experienceText.details[language]}
                      </p>
                      <ul className="ms-5 mt-3 flex list-disc flex-col gap-3 text-room-mid">
                        {card.details[language].map((detail, index) => (
                          <li key={index} className="max-w-[66ch] leading-relaxed">
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
