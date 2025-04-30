import React, { forwardRef } from "react";
import ProjectCarousel from "./ProjectCarousel";
import ProjectFooter from "./ProjectFooter";
import { motion } from "motion/react";
import { useMedia } from "../../context/MediaContext";
import { useLanguage } from "../../context/LanguageContext";

const ShowcaseProject = forwardRef(({ project, }, ref) => {
  const { isMobile } = useMedia();
  const { language } = useLanguage();

  return (
    <motion.div className="project " ref={ref}>
      <div className={`relative ${project.bgColor} rounded-lg overflow-hidden`}>
        <ProjectCarousel
          images={project.carousel || [project.thumbnail]}
          videoUrl={project.videoPath}
          projectTitle={project.title}
          projectDesc={project.desc[language]}
          className="absolute inset-0"
          isShowcase
        />
      </div>
      <div className="text-content flex flex-col gap-4 my-4">
        <h2 className="text-white text-xl font-bold md:text-2xl leading-5">{project.title}</h2>
        {!isMobile && (
          <p className="text-white text-sm md:text-lg leading-5">{project.desc[language] }</p>
        )}
        <ProjectFooter project={project} />
      </div>
    </motion.div>
  );
});

export default ShowcaseProject;
