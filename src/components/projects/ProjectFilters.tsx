import { motion } from "motion/react";
import { projectFilterText } from "../../constants";
import { useLanguage } from "../../context/LanguageContext";
import type { ProjectFilter } from "../../utils/projectFilter";
import { cn } from "../../utils";

const FILTERS: ProjectFilter[] = ["all", "personal", "professional"];

interface ProjectFiltersProps {
  filter: ProjectFilter;
  onFilterChange: (next: ProjectFilter) => void;
  counts: Record<ProjectFilter, number>;
  query: string;
  onQueryChange: (next: string) => void;
}

const ProjectFilters = ({
  filter,
  onFilterChange,
  counts,
  query,
  onQueryChange,
}: ProjectFiltersProps) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse md:items-end md:justify-between">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="project-search"
          className="font-mono text-[11px] tracking-[0.08em] text-room-low uppercase"
        >
          {projectFilterText.searchLabel[language]}
        </label>
        <div className="flex h-11 items-center gap-2.5 rounded-xl border border-[var(--room-line)] bg-room-surface px-3.5 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] focus-within:border-room-accent md:w-[340px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-room-low"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={projectFilterText.searchPlaceholder[language]}
            className="min-w-0 flex-1 bg-transparent text-sm text-room-hi placeholder:text-room-low focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label={projectFilterText.clear[language]}
              className="shrink-0 cursor-pointer text-room-low transition-colors duration-[var(--dur-fast)] hover:text-room-hi"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* A bucket with nothing in it reads as a gap rather than a filter,
            so it stays hidden until it has something to show. */}
        {FILTERS.filter((key) => counts[key] > 0).map((key) => {
          const active = key === filter;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              aria-pressed={active}
              className={cn(
                "relative flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm",
                "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] focus-visible:outline-none",
                active
                  ? "border-room-accent text-room-on-accent"
                  : "border-[var(--room-line-strong)] text-room-hi hover:border-room-accent focus-visible:border-room-accent"
              )}
            >
              {/* One pill that travels between chips, rather than one
                  switching off while another switches on. */}
              {active && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 rounded-full bg-room-accent"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative z-10 font-medium">
                {projectFilterText[key][language]}
              </span>
              <span
                className={cn(
                  "relative z-10 font-mono text-xs",
                  active ? "opacity-70" : "text-room-low"
                )}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectFilters;
