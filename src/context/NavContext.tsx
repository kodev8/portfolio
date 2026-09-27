import {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";

type SectionRef = RefObject<HTMLElement | null>;

interface NavContextValue {
  activeNav: string | null;
  setActiveNav: Dispatch<SetStateAction<string | null>>;
  navBarRef: RefObject<HTMLElement | null>;
  sections: Record<string, SectionRef>;
  registerSection: (id: string, ref: SectionRef) => void;
  logoRef: RefObject<HTMLElement | null>;
}

// Create the context
const NavContext = createContext<NavContextValue>({
  activeNav: null,
  setActiveNav: () => {},
  navBarRef: { current: null },
  sections: {},
  registerSection: () => {},
  logoRef: { current: null },
});

// Provider component
export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const navBarRef = useRef<HTMLElement | null>(null);
  const [sections, setSections] = useState<Record<string, SectionRef>>({});
  const logoRef = useRef<HTMLElement | null>(null);
  const registerSection = useCallback((id: string, ref: SectionRef) => {
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
      let currentSection: string | null = null;

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
