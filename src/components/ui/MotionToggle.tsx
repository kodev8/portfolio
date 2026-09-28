import { useMotion } from "../../context/MotionContext";
import { useLanguage } from "../../context/LanguageContext";
import { motionToggleText } from "../../constants";
import { cn } from "../../utils";

/**
 * Lets a visitor turn the site's animation down without touching their OS
 * settings. Motion is a headline feature here, so the escape hatch has to be
 * in reach rather than buried.
 */
const MotionToggle = ({ className }: { className?: string }) => {
  const { motion, toggleMotion } = useMotion();
  const { language } = useLanguage();
  const isFull = motion === "full";

  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-pressed={!isFull}
      aria-label={
        isFull ? motionToggleText.reduce[language] : motionToggleText.restore[language]
      }
      title={
        isFull ? motionToggleText.reduce[language] : motionToggleText.restore[language]
      }
      className={cn(
        "group flex h-9 cursor-pointer items-center gap-2 rounded-[10px] border px-2.5",
        "border-[var(--room-line-strong)] bg-transparent",
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
        "hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none",
        className
      )}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isFull ? "var(--color-room-accent)" : "var(--color-room-low)"}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isFull ? (
          <path d="M3 12h4l3-7 4 14 3-7h4" />
        ) : (
          <path d="M3 12h18" />
        )}
      </svg>
      <span
        className={cn(
          "relative block h-[18px] w-[30px] rounded-full",
          "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
          isFull ? "bg-room-accent" : "bg-[var(--room-line-strong)]"
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] block size-[14px] rounded-full",
            "transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)]",
            isFull ? "right-[2px] bg-room-on-accent" : "left-[2px] bg-room-mid"
          )}
        />
      </span>
    </button>
  );
};

export default MotionToggle;
