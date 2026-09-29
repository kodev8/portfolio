import { projectFilterText } from "../../constants";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "../../utils";

/**
 * Marks a project that is still being built.
 *
 * Deliberately not a third colour. The palette has two accents with jobs
 * already — accent is interaction, featured is editorial emphasis — so status
 * reads as an outlined chip that differs in lightness rather than hue, with a
 * live dot doing the work a colour would. The dot stops under reduced motion,
 * which is correct here: it is decoration, not progress feedback.
 */
const InProgressBadge = ({ className }: { className?: string }) => {
  const { language } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--room-line-strong)] bg-room-ground/80 px-2.5 py-1",
        "font-mono text-[10px] tracking-[0.08em] text-room-mid uppercase",
        className
      )}
    >
      <span className="relative flex size-1.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-room-accent opacity-70" />
        <span className="relative inline-flex size-1.5 rounded-full bg-room-accent" />
      </span>
      {projectFilterText.inProgress[language]}
    </span>
  );
};

export default InProgressBadge;
