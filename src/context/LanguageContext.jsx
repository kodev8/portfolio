import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export default LanguageContext;

const LanguageProvider = ({ children }) => {

    const [language, setLanguage] = useState("en");

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    const updateLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem("language", newLanguage);
    }

    return <LanguageContext.Provider value={{ language, updateLanguage }}>{children}</LanguageContext.Provider>;
};

export { LanguageContext, LanguageProvider };
    
export const useLanguage = () => {
    return useContext(LanguageContext);
}
