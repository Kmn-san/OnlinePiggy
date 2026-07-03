import countries from "i18n-iso-countries";

import en from "i18n-iso-countries/langs/en.json";
import ja from "i18n-iso-countries/langs/ja.json";
import zh from "i18n-iso-countries/langs/zh.json";

countries.registerLocale(en);
countries.registerLocale(ja);
countries.registerLocale(zh);


export default countries;