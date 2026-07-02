import { createContext, useContext, useEffect, useState } from "react";
import { languageService } from "../lib/languageService";

export type Language = "en" | "ja" | "zh";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>(null!);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setCurrentLanguage] = useState<Language>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = (await languageService.initializeLanguage()) as Language;

      setCurrentLanguage(lang);
    };

    loadLanguage();
  }, []);
  useEffect(() => {
  }, [language]);

  const setLanguage = async (lang: Language) => {
    await languageService.setLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);