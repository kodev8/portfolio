import { useEffect, useRef, forwardRef, type RefObject } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useMedia } from "../../context/MediaContext";
import { portfolioProjects as items } from "../../constants";
import { cn } from "../../utils";
import { useNav } from "../../context/NavContext";
import ProjectFooter from "../../components/projects/ProjectFooter";
import ProjectCarousel from "../../components/projects/ProjectCarousel";
import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../types";

const imgFromLeftVariants: Variants = {
  initial: {
    x: -500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const textFromRightVariants: Variants = {
  initial: {
    x: 500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05,
    },
  },
};

const textFromLeftVariants: Variants = {
  initial: {
    x: -500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05,
    },
  },
};

const imgFromRightVariants: Variants = {
  initial: {
    x: 500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05,
    },
  },
};

interface ListItemProps {
  item: Project;
  dir: "ltr" | "rtl";
  isInView: boolean;
}

const ListItem = ({ item, dir, isInView }: ListItemProps) => {
  const { language } = useLanguage();
  const { isMobile } = useMedia();
  const imgVariants = dir === "ltr" ? imgFromLeftVariants : imgFromRightVariants;
  const textVariants = dir === "ltr" ? textFromRightVariants : textFromLeftVariants;

  const shouldAnimate = isMobile ? "animate" : isInView ? "animate" : "initial";

  return (
    <div
      data-name={item.title}
      className={cn(
        "flex w-full flex-col gap-x-6 gap-y-2 px-6 md:max-w-6xl md:flex-row",
        {
          "items-center": isMobile,
          "md:mb-4 md:items-end": dir === "ltr",
        }
      )}
    >
      {/* img div */}
      <motion.div
        variants={imgVariants}
        animate={shouldAnimate}
        // One 16:9 frame for every project, so rows line up instead of each
        // carousel taking the aspect ratio of whatever was screenshotted.
        className={cn("aspect-video w-full overflow-hidden rounded-2xl md:w-1/2", {
          "order-1": isMobile || dir === "ltr",
          "order-2": !isMobile && dir === "rtl",
        })}
      >
        {item.carousel && (
          <ProjectCarousel
            images={item.carousel}
            videoUrl={item.videoPath}
            projectTitle={item.title}
            projectDesc={item.desc[language]}
            className="h-full"
            containerStyle={{ position: "relative", height: "100%" }}
          />
        )}
      </motion.div>

      {/* text */}
      <motion.div
        variants={textVariants}
        animate={shouldAnimate}
        className={cn("flex w-full flex-col gap-6 md:w-2/5", {
          "order-2": isMobile || dir === "ltr",
          "order-1 items-end": !isMobile && dir === "rtl",
        })}
      >
        <motion.h3 className="type-h3" variants={textVariants}>
          {item.title}
        </motion.h3>
        {/* Hide description on mobile */}
        {!isMobile && (
          <motion.p className="type-body" variants={textVariants}>
            {item.desc[language]}
          </motion.p>
        )}

        <ProjectFooter
          project={item}
          variants={textVariants}
          className={cn("flex flex-wrap gap-2", {
            "items-end justify-end": !isMobile && dir === "rtl",
          })}
        />
      </motion.div>
    </div>
  );
};

interface ListSectionProps {
  item1: Project;
  // An odd project count leaves the last section with no second item
  item2?: Project;
}

const ListSection = forwardRef<HTMLDivElement, ListSectionProps>(
  ({ item1, item2 }, ref) => {
    const isInView = useInView(ref as RefObject<HTMLDivElement | null>, {
      margin: "-100px",
      once: false,
    });
    return (
      <div
        className={`flex-center relative flex flex-col gap-16 md:mt-12 md:h-screen md:min-w-screen md:gap-4`}
        ref={ref}
      >
        {/* First item - Image on left, text on right */}
        <ListItem item={item1} dir="ltr" isInView={isInView} />

        {/* second item - image on left, text on right */}
        {item2 && <ListItem item={item2} dir="rtl" isInView={isInView} />}
      </div>
    );
  }
);

const Portfolio = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { isMobile } = useMedia();
  const numPages = Math.ceil(items.length / 2);
  const itemRefs: RefObject<HTMLDivElement | null>[] = Array.from(
    { length: numPages },
    // Constant length, so hook order is stable across renders
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef<HTMLDivElement | null>(null)
  );
  const { registerSection } = useNav();

  useEffect(() => {
    registerSection("portfolio", containerRef);
  }, [registerSection]);

  // use scroll progress to control horizontal movement target the scrollable container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // transform scrollY progress maps to horizontal movement
  const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -containerWidth * (numPages - 1)]
  );

  return (
    <section
      id="portfolio"
      className="content-section md:snap-container main-section relative w-screen"
      // Height drives the horizontal scroll: useScroll maps this section's
      // travel onto the strip's x. It used to be set with a Tailwind class
      // built from data (`h-[${numPages * 100}vh]`), which Tailwind cannot
      // see and therefore purged — the section collapsed to content height,
      // scrollYProgress ran 0..1 almost instantly, and the strip sat at its
      // end state while later sections were on screen.
      style={{ height: isMobile ? undefined : `${numPages * 100}vh` }}
      ref={containerRef}
    >
      <motion.div
        className={
          "flex w-screen max-w-screen flex-col gap-16 md:sticky md:top-0 md:h-screen md:w-max md:flex-row md:gap-2"
        }
        style={{
          x: isMobile ? 0 : x,
        }}
      >
        {(
          items
            .map((_, index) =>
              index % 2 === 0 ? [items[index], items[index + 1]] : null
            )
            .filter(Boolean) as [Project, Project | undefined][]
        ).map((item, index_) => {
          return (
            <ListSection
              ref={itemRefs[index_]}
              key={index_}
              item1={item[0]}
              item2={item[1]}
            />
          );
        })}
      </motion.div>

      {/* used to control the scroll snap */}
      {!isMobile &&
        Array.from({ length: numPages - 1 }).map((_, index) => (
          <section key={index} className={`snap-item top-0 h-screen w-screen`} />
        ))}
    </section>
  );
};

export default Portfolio;

// debugging
// const firstItemRef = useRef()
// const secondItemRef = useRef();
// const thirdItemRef = useRef();
// const fourthItemRef = useRef();

// const firstListItemRef = useRef();
// const secondListItemRef = useRef();
// const thirdListItemRef = useRef();

// useEffect(() => {
//   const unsubscribe = scrollYProgress.on("change", (latest) => {
//     console.log("scrollYProgress:", latest);

//     if (
//       firstItemRef?.current &&
//       secondItemRef?.current &&
//       thirdItemRef?.current &&
//       fourthItemRef?.current
//     ) {
//       const rect1 = firstItemRef.current.getBoundingClientRect();
//       const rect2 = secondItemRef.current.getBoundingClientRect();
//       const rect3 = thirdItemRef.current.getBoundingClientRect();
//       const rect4 = fourthItemRef.current.getBoundingClientRect();

//       console.log("rect1", rect1);
//       console.log("rect2", rect2);
//       console.log("rect3", rect3);
//       console.log("rect4", rect4);
//       console.log("containerRef", containerRef.current.getBoundingClientRect());
//       console.log("x", x.get());
//     }
//   });

//   return () => unsubscribe(); // Cleanup on unmount
// }, []);

{
  /* <div className="h-screen w-screen flex-center">
          <div className="p-12 border-2 bg-red-500"/>
        </div>
        <div className="h-screen w-screen flex-center p-12">
          <div className="p-12 border-2 bg-blue-500"/>
        </div>
        <div className="h-screen w-screen flex-center p-12">
          <div className="p-12 border-2 bg-green-500"/>
        </div>
        <div className="h-screen w-screen flex-center p-12">
          <div className="p-12 border-2 bg-yellow-500"/>
        </div> */
}

{
  /* <section ref={firstItemRef} className="h-screen w-screen snap-item"/>
        <section ref={secondItemRef} className="h-screen w-screen snap-item"/>
        <section ref={thirdItemRef} className="h-screen w-screen snap-item"/> */
}
{
  /* <section ref={fourthItemRef} className="h-screen w-screen snap-item bg-yellow-500"/> */
}
