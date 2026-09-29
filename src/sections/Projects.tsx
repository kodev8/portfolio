import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import TitleHeader from "../components/TitleHeader";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDialog from "../components/projects/ProjectDialog";
import ProjectFilters from "../components/projects/ProjectFilters";
import { orderedProjects, projectFilterText, showCaseHeader } from "../constants";
import { useLanguage } from "../context/LanguageContext";
import { useMotion } from "../context/MotionContext";
import { useNav } from "../context/NavContext";
import {
  countByFilter,
  filterProjects,
  type ProjectFilter,
} from "../utils/projectFilter";

/** One row of three on a wide screen; "show more" reveals the rest. */
const PAGE_SIZE = 6;

/**
 * Every project in one filterable grid.
 *
 * This replaces a featured strip plus a horizontally-scrolled showcase whose
 * height was `numPages * 100vh` — nine projects meant 900vh of scroll-jacking
 * to reach the last one, so in practice nobody did. A grid with a filter is two
 * screens, and the set is small enough that one query over name *and* stack
 * beats a rack of technology chips.
 */
const Projects = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useNav();
  const { language } = useLanguage();
  const { motion: motionPreference } = useMotion();

  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /**
   * Narrowing the grid makes the section shorter, which pulls everything below
   * it up past the viewport — filter to three projects while reading the
   * bottom of the grid and you land in Experience. Re-anchoring on the
   * section's own top keeps the control the visitor just used on screen.
   */
  const anchorSection = () => {
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (top >= 0) return;
    sectionRef.current?.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    registerSection("projects", sectionRef);
  }, [registerSection]);

  const counts = useMemo(() => countByFilter(orderedProjects), []);
  const matches = useMemo(
    () => filterProjects(orderedProjects, filter, query),
    [filter, query]
  );

  // Narrowing the set and leaving the old page size would show "Showing 6 of
  // 3", and widening it again should not keep a stale expansion.
  useEffect(() => {
    setShown(PAGE_SIZE);
  }, [filter, query]);

  const visible = matches.slice(0, shown);
  const remaining = matches.length - visible.length;

  return (
    <section id="projects" ref={sectionRef} className="content-section main-section">
      <div className="flex w-full flex-col">
        <TitleHeader
          index="03"
          title={showCaseHeader.title[language]}
          sub={showCaseHeader.sub[language]}
        />

        {/* The CSS override cannot reach motion/react, which animates inline
            styles from JS. Without this bridge the toggle is a lie on the one
            section with the most movement on the page. */}
        <MotionConfig
          reducedMotion={motionPreference === "reduced" ? "always" : "never"}
        >
          <div className="mt-10 flex flex-col gap-6 px-[var(--page-x)]">
            <ProjectFilters
              filter={filter}
              onFilterChange={(next) => {
                setFilter(next);
                anchorSection();
              }}
              counts={counts}
              query={query}
              onQueryChange={setQuery}
            />

            {matches.length === 0 ? (
              <p className="py-16 text-center text-room-mid">
                {projectFilterText.noMatch[language]}
              </p>
            ) : (
              <motion.div
                layout
                // One row's worth of floor, so small result sets do not
                // collapse the section into a jump.
                className="grid min-h-[340px] grid-cols-1 content-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {visible.map((match) => (
                    <ProjectCard
                      key={match.project.id}
                      match={match}
                      query={query}
                      onOpen={() =>
                        setOpenIndex(
                          matches.findIndex((m) => m.project.id === match.project.id)
                        )
                      }
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {matches.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                {remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setShown((current) => current + PAGE_SIZE)}
                    className="flex h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--room-line-strong)] px-5 text-sm font-semibold text-room-hi transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none"
                  >
                    {projectFilterText.showMore[language]}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )}
                <span
                  aria-live="polite"
                  className="font-mono text-[11px] tracking-[0.08em] text-room-low uppercase"
                >
                  {projectFilterText.showing[language]} {visible.length}{" "}
                  {projectFilterText.of[language]} {matches.length}
                </span>
              </div>
            )}
          </div>
        </MotionConfig>
      </div>

      <ProjectDialog
        projects={matches.map((match) => match.project)}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </section>
  );
};

export default Projects;
