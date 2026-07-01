import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "./i18n";

export type Language = "en" | "ja" | "zh";

const LANGUAGE_KEY = "@app_language";

export const languageService = {
  async initializeLanguage(): Promise<Language> {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    const language: Language =
      savedLanguage === "ja" || savedLanguage === "zh"
        ? savedLanguage
        : "en";

    i18n.locale = language;
    return language;
  },

  async getLanguage(): Promise<Language> {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    return savedLanguage === "ja" || savedLanguage === "zh"
      ? savedLanguage
      : "en";
  },

  async setLanguage(language: Language) {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    i18n.locale = language;
  },

  async clearLanguage() {
    await AsyncStorage.removeItem(LANGUAGE_KEY);
    i18n.locale = "en";
  },
};