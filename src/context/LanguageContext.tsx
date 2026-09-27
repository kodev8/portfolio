import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Language } from "../types";

interface LanguageContextValue {
  language: Language;
  updateLanguage: (newLanguage: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  updateLanguage: () => {},
});

export default LanguageContext;

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage === "en" || storedLanguage === "fr") {
      setLanguage(storedLanguage);
    }
  }, []);

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };

export const useLanguage = () => {
  return useContext(LanguageContext);
};
