import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const Experience = ({ cards, type }) => {
  useGSAP(() => {
    // Loop through each timeline card and animate them in
    // as the user scrolls to each card
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      // Animate the card coming in from the left
      // and fade in
      gsap.from(card, {
        // Move the card in from the left
        xPercent: -100,
        // Make the card invisible at the start
        opacity: 0,
        // Set the origin of the animation to the left side of the card
        transformOrigin: "left left",
        // Animate over 1 second
        duration: 1,
        // Use a power2 ease-in-out curve
        ease: "power2.inOut",
        // Trigger the animation when the card is 80% of the way down the screen
        scrollTrigger: {
          // The card is the trigger element
          trigger: card,
          // Trigger the animation when the card is 80% down the screen
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
            start: "top 80% center",
            end: "60% center",
            onUpdate: (self) => {
              gsap.set(timeline, {
                scaleY: 1 - self.progress,
                transformOrigin: "bottom bottom",
              });
            },
          });
        });
      },
    
      // Mobile (optional fallback behavior or different animation)
      "(max-width: 767px)": function () {
        gsap.utils.toArray(".timeline").forEach((timeline) => {
          ScrollTrigger.create({
            trigger: timeline,
            start: "top 90%", // maybe more generous trigger for mobile
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
    
      // All screens (optional if needed)
      "all": function () {
        // Reset or common behaviors
      },
    });
    

    // Loop through each expText element and animate them in
    // as the user scrolls to each text element
    gsap.utils.toArray(".expText").forEach((text) => {
      // Animate the text opacity from 0 to 1
      // and move it from the left to its final position
      // over 1 second with a power2 ease-in-out curve
      gsap.from(text, {
        // Set the opacity of the text to 0
        opacity: 0,
        // Move the text from the left to its final position
        // (xPercent: 0 means the text is at its final position)
        xPercent: 0,
        // Animate over 1 second
        duration: 1,
        // Use a power2 ease-in-out curve
        ease: "power2.inOut",
        // Trigger the animation when the text is 60% down the screen
        scrollTrigger: {
          // The text is the trigger element
          trigger: text,
          // Trigger the animation when the text is 60% down the screen
          start: "top 60%",
        },
      });
    }, "<"); // position parameter - insert at the start of the animation
  }, []);

  // const colors = ["bg-red-500/50", "bg-blue-500/50", "bg-green-500/50", "bg-yellow-500/50"];
  return (
    <section className="mt-10 xl:mt-38">
      <div className="h-full w-full px-5 md:px-20">
        {/* <TitleHeader
          title={title}
          sub={subtitle}
        /> */}

        <div className="relative">
          <div className="relative z-50 space-y-10 xl:space-y-32">
            {cards.map((card, index) => (
              <div key={card.title} className="grid grid-cols-12 gap-10">
                <div className="hidden xl:block xl:col-span-1"></div>
                <div className="order-3 col-span-full flex w-full flex-col items-end   xl:order-1 xl:col-span-4 xl:translate-x-10">
                  <GlowCard
                    card={card}
                    className="w-full max-h-32 xl:max-h-36 flex-center"
                  >
                    <img
                      src={card.imgPath}
                      alt="exp-img"
                      className="h-full object-cover"
                      style={{ transform: `scale(${card.imgScale ?? 1})` }}
                    />
                  </GlowCard>
                </div>

                <div className="relative order-1 xl:order-2 col-span-2 flex justify-end xl:col-span-1">
                  <div className="timeline-wrapper mt-4 mx-auto">
                    <div className={`timeline bg-black`} />
                    <div className={`gradient-line h-[180%] lg:h-[220%] bg-gradient-to-b ${card.gradient}`} />
                  </div>
                  <div className="timeline-logo translate-x-5 md:translate-x-10">
                    <img src={card.logoPath} alt="logo" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="col-span-10 order-2 xl:col-span-5 xl-order-3 ml-4">
                  <div className="flex items-start">
                    <div className="expText relative z-20 flex gap-5 md:gap-10 xl:gap-20">
                      <div className="text-wrap">
                        <h1 className="text-xl font-semibold">{card.title}</h1>
                        <p className="text-white-50 my-5">
                          🗓️&nbsp;{card.date}
                        </p>
                        {
                          card.location && (
                            <p className="text-white-50 my-5">
                              📍&nbsp;{card.location}
                            </p>
                          )
                        }
  
                        <p className="italic text-[#839CB5]">Details</p>
                        <ul className="text-white-50 ms-5 mt-5 flex list-disc flex-col gap-5">
                          {card.details.map((detail, index) => (
                            <li key={index} className="text">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div>
                <div className="xl:w-4/6">
               
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
