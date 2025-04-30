import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import {
  expWorkCards,
  expEducationCards,
  expCertifications,
  experienceTabs,
} from "../constants";
import Experience from "../components/Experience";
import TitleHeader from "../components/TitleHeader";
import { cn } from "../utils";
import { useNav } from "../context/NavContext";
import { useLanguage } from "../context/LanguageContext";

const ExperienceSection = () => {
  const [activeTab, setActiveTab] = useState("work");
  const [previousTab, setPreviousTab] = useState(null);
  const tabsRef = useRef(null);
  const highlightRef = useRef(null);
  const contentRef = useRef(null);
  const titleHeaderRef = useRef(null);
  const sectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  const { registerSection } = useNav();
  const { language } = useLanguage();

  // Register this section with the NavContext
  useEffect(() => {
    if (sectionRef.current) {
      registerSection("experience", sectionRef);
    }
  }, [registerSection]);

  // Get the slide direction based on previous and current tab
  const getSlideDirection = (previous, current) => {
    const tabOrder = Object.keys(experienceTabs);

    if (!previous) return "right"; // Default first load

    const prevIndex = tabOrder.indexOf(previous);
    const currIndex = tabOrder.indexOf(current);

    return prevIndex < currIndex ? "right" : "left";
  };

  // Initialize highlight position on first render
  useEffect(() => {
    if (tabsRef.current && highlightRef.current) {
      const activeTabElement = tabsRef.current.querySelector(
        `.tab-${activeTab}`
      );

      if (activeTabElement) {
        // Set initial position and size of highlight
        gsap.set(highlightRef.current, {
          width: activeTabElement.offsetWidth,
          height: activeTabElement.offsetHeight,
          x: activeTabElement.offsetLeft,
          y: 0,
        });
      }
    }
  }, []);

  // Update highlight position when tab changes
  useEffect(() => {
    const activeTabElement = tabsRef.current?.querySelector(
      `.tab-${activeTab}`
    );

    if (activeTabElement && highlightRef.current) {
      // Animate the highlight to the position of the active tab
      gsap.to(highlightRef.current, {
        width: activeTabElement.offsetWidth,
        x: activeTabElement.offsetLeft,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Animate content if we have a previous tab (not first load)
    if (contentRef.current && previousTab) {
      const direction = getSlideDirection(previousTab, activeTab);
      const xStart = direction === "right" ? 100 : -100;

      // First hide the content off-screen
      gsap.fromTo(
        contentRef.current,
        {
          autoAlpha: 0,
          x: xStart,
        },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, [activeTab, previousTab]);

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(tab);

      // Add a small delay to ensure the DOM has updated with new content
      setTimeout(() => {
        if (contentRef.current && titleContainerRef.current) {
          // Get the sticky header height
          const headerHeight = titleContainerRef.current.offsetHeight;

          // Get the element's position relative to the viewport
          const contentRect = contentRef.current.getBoundingClientRect();

          // Calculate the scroll position needed to place the content just below the header
          const scrollPosition =
            window.scrollY + contentRect.top - headerHeight - 40;

          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      }, 150); // Slightly longer delay to ensure content has rendered
    }
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="flex-center content-section section-padding main-section !mt-0 md:!mt-20 xl:px-0 xl:pb-26 w-screen"
    >
      <div className=" mx-auto px-4">
        {/* Sticky title header */}
        <TitleHeader
          ref={titleContainerRef}
          // title={titles[activeTab].title}
          sub={experienceTabs[activeTab].sub[language]}
        >
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gray-800 p-1 text-xs rounded-full shadow-lg">
              <div ref={tabsRef} className="flex relative p-1">
                <div
                  ref={highlightRef}
                  id="experience"
                  className="absolute bg-[#000000] rounded-full z-1"
                  style={{ height: "100%" }}
                />

                {Object.keys(experienceTabs).map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      `tab-${tab} cursor-pointer py-2 px-6 rounded-full transition-colors duration-300 relative z-10`,
                      {
                        "text-white font-bold": activeTab === tab,
                        "text-gray-300": activeTab !== tab,
                      }
                    )}
                    onClick={() => handleTabClick(tab)}
                  >
                    {experienceTabs[tab].tabLabel[language]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TitleHeader>

        {/* Content sections with animation */}
        <div
          ref={contentRef}
          className="experience-content overflow-hidden mt-4"
        >
          {activeTab === "work" && (
              <Experience cards={expWorkCards} type="work" />
          )}

          {activeTab === "education" && (
              <Experience cards={expEducationCards} type="education" />
          )}

          {activeTab === "certifications" && (
              <Experience cards={expCertifications} type="certifications" />
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
