import React, { useState, useEffect, useRef } from "react";
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


export function SelectLanguage() {
  const { language, updateLanguage } = useLanguage();
  return (
    <Select value={language} onValueChange={updateLanguage}>
      <SelectTrigger withIcon={false} className="w-fit">
        <SelectValue className="placeholder:font-bold" placeholder={language} />
      </SelectTrigger>
      <SelectContent className=" font-bold">
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="fr">FR</SelectItem>
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

  const imageTimerRef = useRef(null);
  const circleRef = useRef(null);

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
        navBarRef.current = document.querySelector(".navbar");
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
    clearTimeout(imageTimerRef.current);
    resetAnimation();
  };

  const resetAnimation = () => {
    if (circleRef.current) {
      circleRef.current.style.transition = "none";
      circleRef.current.style.strokeDashoffset = CIRCUMFERENCE;
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
        <div ref={logoRef} className="size-12 ml-4 mt-2 p-4 "></div>
        <nav className="desktop absolute left-1/2 -translate-x-1/2">
          <ul>
            {topNavLinks.map(({ href, title }) => {
              const sectionId = href.replace("#", "");
              let isActive = activeNav === sectionId;
              return (
                <li key={href} className={cn("group", { active: isActive })}>
                  <a
                    href={href}
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(sectionId);
                      window.location.hash = href;
                      document.querySelector(href).scrollIntoView({
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

        <nav className="hidden lg:flex ml-auto items-center gap-4 group">
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={24} />
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope size={24} />
          </a>
          <a href="#contact" className="contact-btn">
            <div className="inner">
              <span>Contact</span>
            </div>
          </a>
        </nav>

        {/* profile pic */}

        <div className="flex items-center">
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
