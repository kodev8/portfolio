import { useRef, useEffect, useState, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TitleHeader from "../components/TitleHeader";
import { featuredProjects, showCaseHeader } from "../constants";
import { useNav } from "../context/NavContext";
import ShowcaseProject from "../components/projects/ShowcaseProject";
import { useLanguage } from "../context/LanguageContext";ShowcaseProject


gsap.registerPlugin(ScrollTrigger);


const AppShowcase = () => {
  const sectionRef = useRef(null);
  const projectRefs = Array.from({ length: featuredProjects.length }, () => useRef(null));
  const { language } = useLanguage();
  // State for modal
  const [selectedProject, setSelectedProject] = useState(null);

 
  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = projectRefs.map((ref) => ref.current);
    gsap.utils.toArray(cards).forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=110",
          },
        }
      );
    });
  }, []);

  const { registerSection } = useNav();
  useEffect(() => {
    registerSection("projects", sectionRef);
  }, [registerSection]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="app-showcase content-section main-section"
    >
      <div className="w-full">
        <TitleHeader title={showCaseHeader.title[language]} sub={showCaseHeader.sub[language]} />
        <div className="grid grid-cols-1 justify-items-center lg:grid-cols-2 gap-8 lg:gap-12 mt-16">
          {/* Featured 0 */}

          <div className="lg:col-span-2 lg:max-w-[60%]">
            <ShowcaseProject
              project={featuredProjects[0]}
              ref={projectRefs[0]}
            />
            </div>
          {/* Featured 1 */}
          
            <div className="col-span-1">
            <ShowcaseProject
              project={featuredProjects[1]}
              ref={projectRefs[1]}
            />
            </div>

            {/* Featured 2 */}
            <div className="col-span-1">
            <ShowcaseProject
              project={featuredProjects[2]}
              ref={projectRefs[2]}
            />
            </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
