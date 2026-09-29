import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import ProjectCarousel from "./ProjectCarousel";
import ProjectReadme from "./ProjectReadme";
import InProgressBadge from "./InProgressBadge";
import {
  projectDialogText,
  projectFilterText,
  viewGitHubText,
  viewLiveText,
} from "../../constants";
import { useLanguage } from "../../context/LanguageContext";
import { useMedia } from "../../context/MediaContext";
import { cn } from "../../utils";
import type { Project } from "../../types";

const ExternalIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

const GitHubIcon = () => (
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
    <path d="M9 19c-4 1.4-4-2.2-5.6-2.8M15 21v-3.4a3 3 0 0 0-.8-2.3c2.6-.3 5.4-1.3 5.4-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.3S17 2.4 15 3.8a11.6 11.6 0 0 0-6 0C7 2.4 6.1 2.8 6.1 2.8a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 4.7 9.3c0 4.7 2.8 5.7 5.4 6a3 3 0 0 0-.8 2.3V21" />
  </svg>
);

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
  </svg>
);

interface ProjectDialogProps {
  projects: Project[];
  /** Index into `projects`, or null when nothing is open. */
  index: number | null;
  onIndexChange: (next: number | null) => void;
}

const ProjectDialog = ({ projects, index, onIndexChange }: ProjectDialogProps) => {
  const { language } = useLanguage();
  const { isMobile } = useMedia();

  const [sheetOffset, setSheetOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);

  const open = index !== null;
  const project = open ? projects[index] : undefined;
  const previous = open
    ? projects[(index - 1 + projects.length) % projects.length]
    : undefined;
  const next = open ? projects[(index + 1) % projects.length] : undefined;

  /** Past this the sheet is going down; short of it, it springs back. */
  const DISMISS_PX = 120;

  const onDragStart = (event: React.PointerEvent) => {
    dragStart.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDragMove = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    // Downward only: dragging up would lift the sheet off the bottom edge.
    setSheetOffset(Math.max(0, event.clientY - dragStart.current));
  };

  const onDragEnd = () => {
    const travelled = sheetOffset;
    dragStart.current = null;
    setIsDragging(false);
    setSheetOffset(0);
    if (travelled > DISMISS_PX) onIndexChange(null);
  };

  // Closing by any other route mid-drag would leave the offset behind, and
  // the next open would start already pushed down.
  useEffect(() => {
    if (!open) {
      dragStart.current = null;
      setIsDragging(false);
      setSheetOffset(0);
    }
  }, [open]);

  const step = (delta: number) => {
    if (index === null || projects.length === 0) return;
    onIndexChange((index + delta + projects.length) % projects.length);
  };

  // Arrow keys walk the set without going back to the grid. Radix already
  // owns Escape, the focus trap and returning focus to the card.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Never steal arrows from a field the visitor is typing in.
      if (target?.closest("input, textarea, select")) return;
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  if (index === null || !project) return null;

  const media = project.carousel ?? (project.thumbnail ? [project.thumbnail] : []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onIndexChange(null)}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[110] bg-[rgb(6_5_12/0.78)]"
        style={sheetOffset ? { transform: `translateY(${sheetOffset}px)` } : undefined}
        className={cn(
          "z-[120] flex flex-col gap-0 overflow-hidden border-[var(--room-line-strong)] bg-room-surface p-0 text-room-hi",
          // Phone: a bottom sheet. Anchored to the bottom edge, full width,
          // rounded only at the top, and it slides up rather than zooming from
          // the middle — a centred dialog is a desktop pattern.
          "top-auto bottom-0 left-0 h-[88dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-3xl rounded-b-none",
          "data-[state=closed]:slide-out-to-bottom data-[state=closed]:zoom-out-100 data-[state=open]:slide-in-from-bottom data-[state=open]:zoom-in-100",
          // From md up it goes back to a centred dialog.
          "md:top-1/2 md:bottom-auto md:left-1/2 md:h-[88vh] md:max-w-3xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl",
          "md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=closed]:zoom-out-95 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-95",
          "lg:h-[min(780px,90vh)] lg:max-w-[1120px]",
          isDragging && "transition-none"
        )}
      >
        {/* The grab handle is the whole drag surface: on a phone the sheet is
            expected to come down with a swipe, not only with the close button. */}
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1 md:hidden"
        >
          <span className="h-1 w-11 rounded-full bg-[var(--room-line-strong)]" />
        </div>

        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--room-line)] py-4 pr-4 pl-5 md:pl-6">
          <DialogTitle className="text-xl font-bold tracking-[-0.02em] text-room-hi md:text-2xl">
            {project.title}
          </DialogTitle>
          {project.featured && (
            <span className="rounded-full bg-room-featured px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-[#2A0316] uppercase">
              {projectFilterText.featured[language]}
            </span>
          )}
          <span className="font-mono text-[11px] tracking-[0.08em] text-room-low uppercase">
            {projectFilterText[project.category][language]}
          </span>
          {project.inProgress && <InProgressBadge className="hidden sm:inline-flex" />}
          <div className="flex-1" />
          <DialogClose
            aria-label={projectDialogText.close[language]}
            className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--room-line-strong)] transition-colors duration-[var(--dur-fast)] hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </DialogClose>
        </div>

        <div
          className={cn(
            "grid min-h-0 min-w-0 flex-1 gap-6 overflow-x-hidden overflow-y-auto p-5 md:p-6",
            // Stacked, the two rows would divide the sheet's fixed height
            // between them and squash the media out of its aspect ratio.
            // Natural row heights, and the sheet scrolls instead.
            "auto-rows-min content-start",
            "lg:auto-rows-auto lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:content-stretch lg:overflow-hidden"
          )}
        >
          <div className="flex min-h-0 min-w-0 flex-col gap-3">
            <div className="flex h-[300px] w-full shrink-0 flex-col sm:h-[380px] lg:h-[440px]">
              {media.length > 0 && (
                <ProjectCarousel
                  images={media}
                  videoUrl={project.videoPath}
                  projectTitle={project.title}
                  projectDesc={project.desc[language]}
                  // The in-lightbox view: slide dots, always-visible arrows
                  // and video controls. It also returns before the carousel's
                  // own Dialog, so there is no dialog inside a dialog.
                  modal
                  autoplay={false}
                  className="h-full"
                  containerStyle={{ position: "relative", height: "100%" }}
                />
              )}
            </div>
            <DialogDescription className="text-[15px] leading-relaxed text-room-mid">
              {project.desc[language]}
            </DialogDescription>
            {!isMobile && (
              <p className="mt-auto font-mono text-[11px] tracking-[0.04em] text-room-low">
                {projectDialogText.keyboardHint[language]}
              </p>
            )}
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[var(--room-line)] px-2 py-1 font-mono text-[10px] text-room-mid"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center gap-2 rounded-xl bg-room-accent px-4.5 text-sm font-semibold text-room-on-accent"
                >
                  <ExternalIcon />
                  {viewLiveText[language]}
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center gap-2 rounded-xl border border-[var(--room-line-strong)] px-4.5 text-sm font-semibold text-room-hi transition-colors duration-[var(--dur-fast)] hover:border-room-accent"
                >
                  <GitHubIcon />
                  {viewGitHubText[language]}
                </a>
              )}
            </div>

            {/* Client work is closed-source, so there is no readme to show
                and an empty panel saying so is worse than nothing. */}
            {project.readmeUrl && (
              <>
                <div className="h-px bg-[var(--room-line)]" />

                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-room-accent uppercase">
                    {projectDialogText.readme[language]}
                  </span>
                </div>

                <div
                  // Remounting on the project resets the scroll position: without
                  // it you arrive at the next readme already halfway down it.
                  key={project.id}
                  className="h-[240px] overflow-y-auto rounded-xl border border-[var(--room-line)] bg-[#0F0D1E] p-4 sm:h-[300px] lg:h-auto lg:min-h-0 lg:flex-1"
                >
                  <ProjectReadme url={project.readmeUrl} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-[var(--room-line)] px-4 py-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={`${projectDialogText.previous[language]}: ${previous?.title ?? ""}`}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[var(--room-line-strong)] px-3 text-sm text-room-hi transition-colors duration-[var(--dur-fast)] hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none"
          >
            <Chevron dir="left" />
            <span className="hidden max-w-[16ch] truncate sm:inline">
              {previous?.title}
            </span>
          </button>

          <span className="flex-1 text-center font-mono text-[11px] tracking-[0.08em] text-room-low uppercase">
            {index + 1} {projectDialogText.position[language]} {projects.length}
          </span>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`${projectDialogText.next[language]}: ${next?.title ?? ""}`}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[var(--room-line-strong)] px-3 text-sm text-room-hi transition-colors duration-[var(--dur-fast)] hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none"
          >
            <span className="hidden max-w-[16ch] truncate sm:inline">
              {next?.title}
            </span>
            <Chevron dir="right" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
