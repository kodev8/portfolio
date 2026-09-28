import React, { useState, useEffect, useRef, type RefObject } from "react";
import { topNavLinks, contactInfo, navBarImages } from "../constants";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { useNav } from "../context/NavContext";
import { cn } from "../utils";
import { useHero } from "../context/HeroContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useLanguage } from "../context/LanguageContext";
import MotionToggle from "./ui/MotionToggle";
import type { Language } from "../types";


export function SelectLanguage() {
  const { language, updateLanguage } = useLanguage();
  return (
    <Select
      value={language}
      onValueChange={(value: string) => updateLanguage(value as Language)}
    >
      <SelectTrigger
        withIcon={false}
        aria-label="Language"
        className="h-9! w-fit cursor-pointer rounded-[10px] border-[var(--room-line-strong)] bg-transparent px-3
                   font-mono text-xs tracking-[0.06em] text-room-mid uppercase
                   transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]
                   hover:border-room-accent hover:text-room-hi
                   focus-visible:border-room-accent focus-visible:ring-0"
      >
        <SelectValue placeholder={language} />
      </SelectTrigger>
      {/* The popover defaults carry --popover-foreground, which is near-black:
          overriding only the background left the options invisible. */}
      <SelectContent className="min-w-[4.5rem] rounded-xl border-[var(--room-line)] bg-room-surface font-mono text-xs tracking-[0.06em] text-room-mid uppercase">
        <SelectItem
          value="en"
          className="cursor-pointer text-room-mid focus:bg-room-raised focus:text-room-hi data-[state=checked]:text-room-accent"
        >
          EN
        </SelectItem>
        <SelectItem
          value="fr"
          className="cursor-pointer text-room-mid focus:bg-room-raised focus:text-room-hi data-[state=checked]:text-room-accent"
        >
          FR
        </SelectItem>
      </SelectContent>
    </Select>
  );
}



const NavBar = () => {
  const { language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { activeNav, setActiveNav, navBarRef, logoRef } = useNav();
  const { isInteracting } = useHero();

  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);

  const STROKE_WIDTH = 6;
  const RADIUS = 67 - STROKE_WIDTH / 2; // 48
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navBarRef && !navBarRef.current) {
      setTimeout(() => {
        navBarRef.current = document.querySelector<HTMLElement>(".navbar");
      }, 0);
    }
  }, [navBarRef]);

  const handleMouseEnter = () => {
    if (circleRef.current) {
      circleRef.current.style.transition = "stroke-dashoffset 1.5s linear";
      circleRef.current.style.strokeDashoffset = "0";
    }

    imageTimerRef.current = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % navBarImages.length);
      resetAnimation();
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(imageTimerRef.current!);
    resetAnimation();
  };

  const resetAnimation = () => {
    if (circleRef.current) {
      circleRef.current.style.transition = "none";
      circleRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`;
    }
  };

  return (
    <header
      ref={navBarRef}
      className={cn("navbar", {
        scrolled,
        "not-scrolled": !scrolled,
        "opacity-0 pointer-events-none": isInteracting,
      })}
      style={{
        transition: "opacity 0.5s ease-out, background-color 0.3s ease",
      }}
    >
      <div className="inner relative">
        {/* Desktop Nav Links */}
        <div
          ref={logoRef as RefObject<HTMLDivElement | null>}
          className="size-12 ml-4 mt-2 p-4 "
        ></div>
        <nav className="desktop absolute left-1/2 -translate-x-1/2">
          <ul>
            {topNavLinks.map(({ href, title }) => {
              const sectionId = href.replace("#", "");
              const isActive = activeNav === sectionId;
              return (
                <li key={href} className={cn("group", { active: isActive })}>
                  <a
                    href={href}
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(sectionId);
                      window.location.hash = href;
                      document.querySelector(href)!.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >
                    <span className="font-semibold">{title[language]}</span>
                    <span className="underline"></span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* socials */}

        <nav className="ml-auto hidden items-center gap-3 lg:flex">
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={18} className="text-room-low transition-colors duration-[var(--dur-fast)] hover:text-room-hi" />
          </a>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={18} className="text-room-low transition-colors duration-[var(--dur-fast)] hover:text-room-hi" />
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope size={18} className="text-room-low transition-colors duration-[var(--dur-fast)] hover:text-room-hi" />
          </a>
          <a
            href="#contact"
            className="ml-1 flex h-9 items-center rounded-[10px] bg-room-accent px-4 text-sm font-semibold text-room-on-accent
                       transition-[filter] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:brightness-110"
          >
            Contact
          </a>
          <span
            aria-hidden="true"
            className="ml-1 h-5 w-px bg-[var(--room-line-strong)]"
          />
        </nav>

        {/* profile pic */}

        <div className="flex items-center">
          <span className="z-[48] ml-2">
            <MotionToggle />
          </span>
          <span className=" ml-2 mr-3 z-[48]">
            <SelectLanguage />
          </span>

          <div
            className="relative inline-block ml-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative size-12 md:size-16 select-none mr-2 xl:mr-0">
              <div className="absolute inset-0 z-[48] rounded-full outline-4 outline-white overflow-hidden">
                <img
                  src={navBarImages[currentImage].src}
                  alt={navBarImages[currentImage].alt[language]}
                  className="size-full object-cover rounded-full ring-2 ring-muted-foreground/50 ring-offset-2"
                />
              </div>

              <svg
                className="absolute inset-0  overflow-visible size-full rotate-[-90deg] z-[48] pointer-events-none"
                viewBox="0 0 120 120"
              >
                <circle
                  ref={circleRef}
                  cx="60"
                  cy="60"
                  r={RADIUS}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
