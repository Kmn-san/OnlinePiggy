import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const en = require('../locales/en.json');
const ja = require('../locales/ja.json');
const zh = require('../locales/zh.json');

const i18n = new I18n({
  en,
  ja,
  zh,
});

i18n.defaultLocale = 'en';
i18n.locale = Localization.locale || 'en';
i18n.enableFallback = true;

export default i18n;