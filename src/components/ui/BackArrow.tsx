import type { MouseEventHandler } from "react";
import { useHero } from "../../context/HeroContext";
import { cn } from "../../utils";

interface BackArrowProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

const BackArrow = ({ onClick }: BackArrowProps) => {
  const { isInteracting } = useHero();

  return (
    <div
      className={cn(
        "fixed bottom-8 left-10 z-[49] transform cursor-pointer rounded-full bg-black-200 p-2 transition-all duration-300 hover:scale-110 md:p-4",
        {
          "translate-y-0 opacity-100": isInteracting,
          "pointer-events-none translate-y-10 opacity-0": !isInteracting,
        }
      )}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white-50"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </div>
  );
};

export default BackArrow;
