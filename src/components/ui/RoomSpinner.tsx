import { cn } from "../../utils";

const SIZE = 72;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RoomSpinnerProps {
  /**
   * 0-100 once something is reporting real progress. Left undefined the ring
   * spins instead, which is what the chunk download gets: the browser does not
   * tell us how far along a dynamic import is.
   */
  progress?: number;
  label: string;
  className?: string;
}

/**
 * One loading indicator for the whole room, used both while its JavaScript
 * chunk downloads and while the models inside it load. Keeping the same ring
 * on screen across both phases is the point — swapping indicators mid-wait
 * reads as two separate stalls rather than one.
 *
 * Deliberately free of any three/drei import so the hero can render it before
 * the 3D chunk exists.
 */
const RoomSpinner = ({ progress, label, className }: RoomSpinnerProps) => {
  const determinate = typeof progress === "number";
  const clamped = determinate ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={determinate ? `${label} ${Math.round(clamped)}%` : label}
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          // -rotate-90 starts a determinate arc at twelve o'clock; the
          // indeterminate ring spins instead of being anchored.
          className={determinate ? "-rotate-90" : "loader-spin"}
          aria-hidden="true"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--room-line)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-room-accent)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={
              determinate ? CIRCUMFERENCE * (1 - clamped / 100) : CIRCUMFERENCE * 0.72
            }
            style={
              determinate
                ? {
                    transition: "stroke-dashoffset var(--dur) var(--ease-out)",
                  }
                : undefined
            }
          />
        </svg>
        {determinate && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[12px] text-room-mid tabular-nums">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
      <span className="font-mono text-[11px] tracking-[0.08em] text-room-low uppercase">
        {label}
      </span>
    </div>
  );
};

export default RoomSpinner;
