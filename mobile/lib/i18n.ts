import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import en from "../locales/en.json";
import ja from "../locales/ja.json";
import zh from "../locales/zh.json";

const i18n = new I18n({
  en,
  ja,
  zh,
});

i18n.enableFallback = true;

const locales = Localization.getLocales();

i18n.locale =
  locales?.[0]?.languageCode ?? "en";

export default i18n;