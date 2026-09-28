import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion, type Variants } from "motion/react";
import { cn } from "../../utils";
import { useLanguage } from "../../context/LanguageContext";
import { viewLiveText, viewGitHubText } from "../../constants";
import type { Project } from "../../types";

interface ProjectFooterProps {
  project: Project;
  variants?: Variants;
  className?: string;
}

function ProjectFooter({ project, variants, className = "" }: ProjectFooterProps) {
  const { language } = useLanguage();
  return (
    <motion.div className={cn("flex flex-col gap-2", className)} variants={variants}>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={variants}
        style={{
          justifyContent: "inherit",
        }}
      >
        {project.stack.map((tech) => (
          <Badge variant="tech" key={tech}>
            {tech}
          </Badge>
        ))}
      </motion.div>

      <motion.div className="flex gap-2" variants={variants}>
        {project.liveUrl && (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={variants}
          >
            <Button variant="room">{viewLiveText[language]}</Button>
          </motion.a>
        )}
        {project.githubUrl && (
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={variants}
          >
            <Button variant="room-outline">{viewGitHubText[language]}</Button>
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProjectFooter;
