import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from "motion/react";
import { FaBars, FaTimes } from "react-icons/fa";
import type { IconType } from "react-icons";
import { cn } from "../utils";
import { useHero } from "../context/HeroContext";
import { navLinks } from "../constants";
import { useLanguage } from "../context/LanguageContext";

interface NavItemProps {
  mouseX: MotionValue<number>;
  title: string;
  Icon: IconType;
  href: string;
}

const NavItem = ({ mouseX, title, Icon, href }: NavItemProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

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
        className="relative flex aspect-square items-center justify-center rounded-full bg-neutral-800"
      >
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 w-fit -translate-x-1/2 rounded-md border border-neutral-900 bg-neutral-800 px-2 py-0.5 text-xs whitespace-pre text-white"
          >
            {title}
          </motion.div>
        )}
        <motion.div
          style={{ width: iconWidth, height: iconHeight }}
          className="flex items-center justify-center"
        >
          {Icon ? (
            <Icon className="h-full w-full text-neutral-300" />
          ) : (
            <span className="h-full w-full text-neutral-300">hmm</span>
          )}
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
          "fixed bottom-8 left-1/2 z-[48] hidden h-16 -translate-x-1/2 transform items-end gap-4 rounded-2xl bg-neutral-900 px-4 pb-3 md:flex xl:hidden",
          {
            "pointer-events-none opacity-0": isInteracting,
          }
        )}
      >
        {navLinks.map((item) => (
          <NavItem
            key={item.title[language]}
            mouseX={mouseX}
            Icon={item.Icon}
            href={item.href}
            title={item.title[language]}
          />
        ))}
      </motion.div>

      {/* mobile nav*/}
      <div className="fixed right-8 bottom-12 z-[48] md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800"
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
              className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900"
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
