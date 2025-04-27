import React, { forwardRef } from "react";
import ProjectCarousel from "./ProjectCarousel";
import ProjectFooter from "./ProjectFooter";
import { motion } from "motion/react";
import { useMedia } from "../../context/MediaContext";

const ShowcaseProject = forwardRef(({ project }, ref) => {
  const { isMobile } = useMedia();

  return (
    <motion.div className="project flex-1" ref={ref}>
      <div className={`image-wrapper relative ${project.bgColor}`}>
        <ProjectCarousel
          images={project.carousel || [project.thumbnail]}
          videoUrl={project.videoPath}
          projectTitle={project.title}
          projectDesc={project.desc}
          className="absolute inset-0"
        />
      </div>
      <div className="text-content flex flex-col gap-4">
        <h2 className="text-white text-xl md:text-2xl leading-5">{project.title}</h2>
        {!isMobile && (
          <p className="text-white-50 text-sm md:text-lg leading-5">{project.desc}</p>
        )}
        <ProjectFooter project={project} />
      </div>
    </motion.div>
  );
});

export default ShowcaseProject;
