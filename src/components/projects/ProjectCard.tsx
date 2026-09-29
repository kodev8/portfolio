import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { projectFilterText } from "../../constants";
import { useLanguage } from "../../context/LanguageContext";
import { useMotion } from "../../context/MotionContext";
import { stackWithMatchesFirst, type ProjectMatch } from "../../utils/projectFilter";
import InProgressBadge from "./InProgressBadge";
import { cn } from "../../utils";

const VISIBLE_TAGS = 3;
/** Dwell before a card starts cycling, so crossing the grid costs nothing. */
const HOVER_INTENT_MS = 200;
/** Time on each slide once it is cycling. */
const SLIDE_MS = 2500;

/**
 * Wrap the matched run of a string so a search result explains itself.
 * Case-insensitive, and the original casing is preserved in the output.
 */
const Highlight = ({ text, query }: { text: string; query: string }) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return <>{text}</>;

  const at = text.toLowerCase().indexOf(needle);
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[3px] bg-room-accent/25 px-0.5 text-room-hi">
        {text.slice(at, at + needle.length)}
      </mark>
      {text.slice(at + needle.length)}
    </>
  );
};

interface ProjectCardProps {
  match: ProjectMatch;
  query: string;
  onOpen: () => void;
}

const ProjectCard = ({ match, query, onOpen }: ProjectCardProps) => {
  const { language } = useLanguage();
  const { motion: motionPreference } = useMotion();
  const { project, matchedStack } = match;

  const stack = stackWithMatchesFirst(project, matchedStack);
  const shown = stack.slice(0, VISIBLE_TAGS);
  const remaining = stack.length - shown.length;
  const thumbnail = project.thumbnail ?? project.carousel?.[0];

  const slides = project.carousel ?? (thumbnail ? [thumbnail] : []);
  const canCycle = slides.length > 1 && motionPreference !== "reduced";

  // `armed` latches on the first hover: the extra slides mount then and stay
  // mounted, so a second hover does not refetch them. At rest the card is one
  // image, which is what keeps a grid of eleven projects cheap.
  const [armed, setArmed] = useState(false);
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);
  const dwell = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!cycling || !canCycle) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS
    );
    return () => window.clearInterval(id);
  }, [cycling, canCycle, slides.length]);

  useEffect(() => () => window.clearTimeout(dwell.current), []);

  const start = (immediate = false) => {
    if (!canCycle) return;
    setArmed(true);
    if (immediate) {
      setCycling(true);
      return;
    }
    // Intent, not a fly-past: a mouse crossing the grid should not start six
    // carousels on its way somewhere else.
    dwell.current = window.setTimeout(() => setCycling(true), HOVER_INTENT_MS);
  };

  const stop = () => {
    window.clearTimeout(dwell.current);
    setCycling(false);
    setIndex(0);
  };

  return (
    <motion.article
      // "position" rather than plain layout: animating width and height as
      // well rubber-bands the card's contents while it travels.
      layout="position"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => start()}
        onPointerLeave={stop}
        onFocus={() => start(true)}
        onBlur={stop}
        aria-label={`${projectFilterText.openProject[language]} ${project.title}`}
        className={cn(
          "group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-room-surface text-left",
          "transition-[border-color,transform] duration-[var(--dur)] ease-[var(--ease-out)]",
          "hover:-translate-y-0.5 focus-visible:outline-none",
          project.featured
            ? "border-room-featured/35 hover:border-room-featured focus-visible:border-room-featured"
            : "border-[var(--room-line)] hover:border-room-accent focus-visible:border-room-accent"
        )}
      >
        <span className="relative block aspect-video w-full overflow-hidden bg-[#0F0D1E]">
          <span
            className="flex h-full w-full scale-[1.01] transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.06]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {(armed ? slides : slides.slice(0, 1)).map((slide, slideIndex) => (
              <img
                key={slide}
                src={slide}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full flex-none object-cover"
                style={{ width: "100%" }}
                aria-hidden={slideIndex !== index}
              />
            ))}
          </span>
          {cycling && slides.length > 1 && (
            <span className="absolute right-2.5 bottom-2.5 rounded-lg border border-[var(--room-line)] bg-room-ground/80 px-2 py-0.5 font-mono text-[10px] text-room-mid tabular-nums backdrop-blur-sm">
              {index + 1}/{slides.length}
            </span>
          )}
          {project.featured && (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-room-featured px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-[#2A0316] uppercase">
              {projectFilterText.featured[language]}
            </span>
          )}
          {project.inProgress && (
            <InProgressBadge className="absolute top-2.5 right-2.5" />
          )}
        </span>

        <span className="flex flex-1 flex-col gap-2 p-4">
          <span className="flex items-baseline gap-2.5">
            <span className="text-lg leading-tight font-bold tracking-[-0.015em] text-room-hi">
              <Highlight text={project.title} query={query} />
            </span>
            <span className="font-mono text-[10px] tracking-[0.08em] text-room-low uppercase">
              {projectFilterText[project.category][language]}
            </span>
          </span>

          <span className="line-clamp-2 text-[13px] leading-relaxed text-room-mid">
            {project.desc[language]}
          </span>

          <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {shown.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "rounded-lg border px-2 py-1 font-mono text-[10px]",
                  matchedStack.includes(tech)
                    ? "border-room-accent/40 text-room-accent"
                    : "border-[var(--room-line)] text-room-mid"
                )}
              >
                <Highlight text={tech} query={query} />
              </span>
            ))}
            {remaining > 0 && (
              <span className="rounded-lg px-2 py-1 font-mono text-[10px] text-room-low">
                +{remaining}
              </span>
            )}
          </span>
        </span>
      </button>
    </motion.article>
  );
};

export default ProjectCard;
