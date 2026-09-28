import { useRef, type MouseEvent, type ReactNode } from "react";
import { assetsPaths } from "../constants";

interface GlowCardProps {
  card?: unknown;
  index?: number;
  children?: ReactNode;
  stars?: number;
  className?: string;
}

const GlowCard = ({ index, children, stars = 0, className }: GlowCardProps) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handleMouseMove = (index?: number) => (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRefs.current[index as number];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // calculate the angle from the center of the card to the mouse
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    // adjust the angle so that it's between 0 and 360
    angle = (angle + 360) % 360;

    // set the angle as a CSS variable
    card.style.setProperty("--start", String(angle + 60));
  };

  return (
    <div
      ref={(el) => {
        cardRefs.current[index as number] = el;
      }}
      onMouseMove={handleMouseMove(index)}
      className={`card card-border timeline-card mb-5 break-inside-avoid-column rounded-xl p-6 transition-all duration-500 hover:border-room-accent/40 ${className}`}
    >
      <div className="glow"></div>

      {stars > 0 && (
        <div className="mb-5 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <img key={i} src={assetsPaths.images.star} alt="star" className="size-5" />
          ))}
        </div>
      )}

      {children}
    </div>
  );
};

export default GlowCard;
