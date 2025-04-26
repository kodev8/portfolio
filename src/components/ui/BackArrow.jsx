import { useHero } from "../../context/HeroContext";
import { cn } from "../../utils";

const BackArrow = ({ onClick }) => {
  const { isInteracting } = useHero();

  return (
    <div
      className={cn(
        "fixed bottom-10 left-10 z-50 bg-black-200 rounded-full p-4 cursor-pointer transition-all duration-300 transform hover:scale-110",
        {
          "opacity-100 translate-y-0": isInteracting,
          "opacity-0 translate-y-10 pointer-events-none": !isInteracting,
        }
      )}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
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
