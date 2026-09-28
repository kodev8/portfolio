import React, { forwardRef } from "react";
import ProjectCarousel from "./ProjectCarousel";
import ProjectFooter from "./ProjectFooter";
import { motion } from "motion/react";
import { useMedia } from "../../context/MediaContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../types";

interface ShowcaseProjectProps {
  project: Project;
}

const ShowcaseProject = forwardRef<HTMLDivElement, ShowcaseProjectProps>(
  ({ project }, ref) => {
    const { isMobile } = useMedia();
    const { language } = useLanguage();

    return (
      <motion.div className="project" ref={ref}>
        <div
          className={`relative aspect-video overflow-hidden rounded-2xl ${project.bgColor}`}
        >
          <ProjectCarousel
            images={project.carousel || [project.thumbnail!]}
            videoUrl={project.videoPath}
            projectTitle={project.title}
            projectDesc={project.desc[language]}
            className="absolute inset-0"
            isShowcase
          />
        </div>
        <div className="text-content my-4 flex flex-col gap-4">
          <h3 className="type-h3 text-room-hi">{project.title}</h3>
          {!isMobile && <p className="type-body">{project.desc[language]}</p>}
          <ProjectFooter project={project} />
        </div>
      </motion.div>
    );
  }
);

export default ShowcaseProject;
