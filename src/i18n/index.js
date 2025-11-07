import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import all language translations
import en from "../locales/en.json";
import te from "../locales/te.json";
import ta from "../locales/ta.json";
import hi from "../locales/hi.json";
// Import new languages
import ml from "../locales/ml/common.json";
import kn from "../locales/kn/common.json";
import mr from "../locales/mr/common.json";
import bn from "../locales/bn/common.json";
import gu from "../locales/gu/common.json";
import pa from "../locales/pa/common.json";

const resources = {
  en: { common: en },
  te: { common: te },
  ta: { common: ta },
  hi: { common: hi },
  ml: { common: ml },
  kn: { common: kn },
  mr: { common: mr },
  bn: { common: bn },
  gu: { common: gu },
  pa: { common: pa },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    ns: ["common"],
    defaultNS: "common",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export function setLanguage(lng) {
  const isRTL = ["ur"].includes(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  localStorage.setItem("lang", lng);
  i18n.changeLanguage(lng);
}

export default i18n;

