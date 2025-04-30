import { useEffect, useRef, useState, forwardRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useMedia } from "../../context/MediaContext";
import { portfolioProjects as items } from "../../constants";
import { cn } from "../../utils";
import { useNav } from "../../context/NavContext";
import ProjectFooter from "../../components/projects/ProjectFooter";
import ProjectCarousel from "../../components/projects/ProjectCarousel";
import { useLanguage } from "../../context/LanguageContext";

const imgFromLeftVariants = {
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

const textFromRightVariants = {
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

const textFromLeftVariants = {
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

const imgFromRightVariants = {
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

const ListItem = ({ item, dir, isInView }) => {
  const { language } = useLanguage();
  const { isMobile } = useMedia();
  const imgVariants =
    dir === "ltr" ? imgFromLeftVariants : imgFromRightVariants;
  const textVariants =
    dir === "ltr" ? textFromRightVariants : textFromLeftVariants;

  const shouldAnimate = isMobile ? "animate" : isInView ? "animate" : "initial";

  return (
    <div
      data-name={item.title}
      className={cn(
        "flex flex-col md:flex-row w-full md:max-w-6xl gap-y-2 gap-x-6 px-6",
        {
          "items-center": isMobile,
          "md:items-end md:mb-4": dir === "ltr",
        }
      )}
    >
      {/* img div */}
      <motion.div
        variants={imgVariants}
        animate={shouldAnimate}
        className={cn(" w-full md:w-1/2 p-2 rounded-2xl overflow-hidden", {
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
        className={cn("w-full md:w-2/5 flex flex-col gap-6 ", {
          "order-2": isMobile || dir === "ltr",
          "order-1 items-end": !isMobile && dir === "rtl",
        })}
      >
        <motion.h2 className="text-2xl font-bold" variants={textVariants}>
          {item.title}
        </motion.h2>
        {/* Hide description on mobile */}
        {!isMobile && (
          <motion.p
            className="font-light text-justify leading-5"
            variants={textVariants}
          >
            {item.desc[language]}
          </motion.p>
        )}

        <ProjectFooter
          project={item}
          variants={textVariants}
          className={cn("flex gap-2 flex-wrap", {
            "items-end justify-end": !isMobile && dir === "rtl",
          })}
        />
      </motion.div>
    </div>
  );
};

const ListSection = forwardRef(({ item1, item2 }, ref) => {
  const isInView = useInView(ref, { margin: "-100px", once: false });
  return (
    <div
      className={`flex flex-col gap-16 relative md:min-w-screen md:h-screen flex-center md:mt-12 md:gap-4`}
      ref={ref}
    >
      {/* First item - Image on left, text on right */}
      <ListItem item={item1} dir="ltr" isInView={isInView} />

      {/* second item - image on left, text on right */}
      <ListItem item={item2} dir="rtl" isInView={isInView} />
    </div>
  );
});

const Portfolio = () => {
  const containerRef = useRef(null);
  const { isMobile } = useMedia();
  const numPages = Math.ceil(items.length / 2);
  const itemRefs = Array.from({ length: numPages }, () => useRef(null));
  const { registerSection } = useNav();
  const { language } = useLanguage();

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
      className={cn("relative content-section md:snap-container w-screen main-section", {
        [`h-[${numPages * 100}vh]`]: !isMobile,
      })}
      ref={containerRef}
    >
      <motion.div
        className={
          "flex flex-col w-screen gap-16 md:gap-2 md:h-screen md:flex-row md:sticky md:top-0 md:w-max max-w-screen"
        }
        style={{
          x: isMobile ? 0 : x,
        }}
      >
        {items
          .map((_, index) =>
            index % 2 === 0 ? [items[index], items[index + 1]] : null
          )
          .filter(Boolean)
          .map((item, index_) => {
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
          <section
            key={index}
            className={`h-screen w-screen top-0 snap-item`}
          />
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
