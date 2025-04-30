import { forwardRef, useEffect } from "react";
import { useNav } from "../context/NavContext";
import { useMedia } from "../context/MediaContext";
import { Tip } from "../components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

const TitleHeader = forwardRef(({ title, sub, children, tipContent }, ref) => {
  const { isMobile } = useMedia();
  const { navBarRef } = useNav();

  return (
    <div
      ref={ref}
      style={{ top: `${isMobile ? 0 : navBarRef.current?.offsetHeight - 16}px` }}
      className={`sticky z-[40] w-full bg-black pt-4 pb-4`}
    >
      {children}

      <div className="flex flex-col items-center gap-3">
        {sub && (
          <div className="hero-badge">
            <p>{sub}</p>
          </div>
        )}

        <div>
          <h1 className="font-semibold md:text-3xl text-xl text-center">
            {title}
            {tipContent && (
              <Tip
                content={tipContent}
                position="top"
                className="text-white-50"
              >
                <FaInfoCircle className="inline-block mx-2 text-base text-white-50" />
              </Tip>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
});

export default TitleHeader;
