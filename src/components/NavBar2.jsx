import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import {
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { cn } from "../utils";
import { useHero } from "../context/HeroContext";
import { navLinks } from "../constants";
import { useLanguage } from "../context/LanguageContext";

const NavItem = ({ mouseX, title, Icon, href }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const iconWidthSync = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const iconHeightSync = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const iconWidth = useSpring(iconWidthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const iconHeight = useSpring(iconHeightSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="aspect-square rounded-full bg-neutral-800 flex items-center justify-center relative"
      >
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md border bg-neutral-800 border-neutral-900 text-white absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
          >
            {title}
          </motion.div>
        )}
        <motion.div
          style={{ width: iconWidth, height: iconHeight }}
          className="flex items-center justify-center"
        >
          {Icon ? <Icon className="h-full w-full text-neutral-300" /> : <span className="h-full w-full text-neutral-300">hmm</span>}
        </motion.div>
      </motion.div>
    </a>
  );
};

const NavBar2 = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const mouseX = useMotionValue(Infinity);
  const { isInteracting } = useHero();

  return (
    <>
      {/* desktop nav*/}
      <motion.div
        id="desktop-nav"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "fixed bottom-8  z-[48] left-1/2 transform -translate-x-1/2 hidden md:flex xl:hidden h-16 gap-4 items-end rounded-2xl  bg-neutral-900 px-4 pb-3",
          {
            "opacity-0 pointer-events-none": isInteracting,
          }
        )}
      >
        {navLinks.map((item) => (
          <NavItem key={item.title[language]} mouseX={mouseX} Icon={item.Icon} href={item.href} title={item.title[language]} />
        ))}
      </motion.div>

      {/* mobile nav*/}
      <div className="fixed bottom-12 right-8 md:hidden z-[48]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center"
        >
          {isOpen ? (
            <FaTimes className="h-5 w-5 text-neutral-400" />
          ) : (
            <FaBars className="h-5 w-5 text-neutral-400" />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
            >
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.title[language]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: 0.05 * index },
                  }}
                  transition={{ delay: (navLinks.length - 1 - index) * 0.05 }}
                >
                  <a
                    href={item.href}
                    className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center"
                  >
                    <div className="h-4 w-4">
                      <item.Icon className="h-full w-full text-neutral-300" />
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NavBar2;
