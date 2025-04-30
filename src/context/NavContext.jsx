import { createContext, useState, useContext, useRef, useEffect, useCallback } from "react";

// Create the context
const NavContext = createContext({
  activeNav: null,
  setActiveNav: () => {},
  navBarRef: null,
  sections: {},
  registerSection: () => { },
  logoRef: null,
});

// Provider component
export const NavProvider = ({ children }) => {
  const [activeNav, setActiveNav] = useState(null);
  const navBarRef = useRef(null);
  const [sections, setSections] = useState({});
  const logoRef = useRef(null);
  const registerSection = useCallback((id, ref) => {
    setSections((prev) => {
      if (prev[id] !== ref) {
        return { ...prev, [id]: ref };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (Object.keys(sections).length === 0) return;

      // Get the navbar height for offset calculation
      const navbarHeight = navBarRef.current?.offsetHeight || 0;
      const scrollPosition = window.scrollY + navbarHeight + 50; // Add some buffer

      // Find the current section in view
      let currentSection = null;

      Object.entries(sections).forEach(([id, sectionRef]) => {
        if (!sectionRef.current) return;

        const { offsetTop, offsetHeight } = sectionRef.current;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          currentSection = id;
        }
      });


      if (currentSection && currentSection !== activeNav) {
        if (currentSection === "portfolio") {
          currentSection = "projects";
        }
        
        setActiveNav(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, activeNav]);

 

  return (
    <NavContext.Provider
      value={{
        activeNav,
        setActiveNav,
        navBarRef,
        sections,
        registerSection,
        logoRef,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

// Custom hook for using the context
export const useNav = () => useContext(NavContext);
