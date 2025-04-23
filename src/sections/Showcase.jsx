import { useRef, useEffect, useState, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TitleHeader from "../components/TitleHeader";
import { featuredProjects } from "../constants";
import { useNav } from "../context/NavContext";
import ShowcaseProject from "../components/projects/ShowcaseProject";

gsap.registerPlugin(ScrollTrigger);


const AppShowcase = () => {
  const sectionRef = useRef(null);
  const projectRefs = Array.from({ length: featuredProjects.length }, () => useRef(null));

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
            start: "top bottom-=100",
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
      className="app-showcase content-section"
    >
      <div className="w-full">
        <TitleHeader title="Projects" sub="⭐ Featured" />
        <div className="showcaselayout mt-16">
          {/* Featured 0 */}
          <div ref={projectRefs[0]} className="first-project-wrapper">
            <ShowcaseProject
              project={featuredProjects[0]}
              ref={projectRefs[0]}
            />
          </div>
          <div className="project-list-wrapper overflow-hidden">
            {/* Featured 1 */}
            <ShowcaseProject
              project={featuredProjects[1]}
              ref={projectRefs[1]}
            />

            {/* Featured 2 */}
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
