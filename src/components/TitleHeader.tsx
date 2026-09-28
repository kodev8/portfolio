import { forwardRef, type ReactNode } from "react";
import { useMedia } from "../context/MediaContext";
import { Tip } from "../components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

interface TitleHeaderProps {
  title?: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
  tipContent?: string | null;
  /** Section number shown before the eyebrow, e.g. "02". */
  index?: string;
}

/**
 * The shared section header: a monospaced accent eyebrow over the heading.
 * `sub` used to render as a pill badge, which read as a control rather than a
 * label and left every section without a real heading.
 */
const TitleHeader = forwardRef<HTMLDivElement, TitleHeaderProps>(
  ({ title, sub, children, tipContent, index }, ref) => {
    const { isMobile } = useMedia();

    return (
      <div
        ref={ref}
        // Offset with the layout token rather than a render-time ref read.
        style={{ top: isMobile ? 0 : "calc(var(--nav-h) - 1rem)" }}
        className="sticky z-[45] w-full bg-room-ground pt-4 pb-4"
      >
        {children}

        <div className="flex flex-col items-center gap-2">
          {sub && (
            <p className="text-center font-mono text-[11px] tracking-[0.08em] text-room-accent uppercase">
              {index && <span className="text-room-low">{index} — </span>}
              {sub}
            </p>
          )}

          {title && (
            <h2 className="text-center text-2xl font-bold tracking-[-0.025em] text-room-hi md:text-4xl">
              {title}
              {tipContent && (
                <Tip content={tipContent} position="top" className="text-room-mid">
                  <FaInfoCircle className="mx-2 inline-block text-base text-room-low" />
                </Tip>
              )}
            </h2>
          )}
        </div>
      </div>
    );
  }
);

export default TitleHeader;
