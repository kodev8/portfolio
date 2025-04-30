import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { motion } from "motion/react";
import { cn } from "../../utils";
import { useLanguage } from "../../context/LanguageContext";
import { viewLiveText, viewGitHubText } from "../../constants";

function ProjectFooter({ project, variants, className="" }) {
  const { language } = useLanguage();
  return (
    <motion.div className={cn("flex flex-col gap-2", className)} variants={variants}>
          <motion.div className="flex gap-2 flex-wrap" variants={variants}
              style={{
                justifyContent: "inherit",
              }}
          >
        {project.stack.map((tech) => (
          <Badge className="bg-slate-600 text-white-50" key={tech}>
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
            <Button variant="outline">{viewLiveText[language]}</Button>
          </motion.a>
        )}
        {project.githubUrl && (
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={variants}
          >
            <Button variant="outline">{viewGitHubText[language]}</Button>
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProjectFooter;
