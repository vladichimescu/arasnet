import i18n from "i18next"
import ICU from "i18next-icu"

import en from "./translations/en.json" with { type: "json" }
import ro from "./translations/ro.json" with { type: "json" }

const languages = {
  enGB: "en-GB",
  enUS: "en-US",
  roRo: "ro-RO",
}

const fallbackLng = languages.enGB

const lng =
  (typeof window !== "undefined" && localStorage.locale) ||
  process.env.LOCALE ||
  process.env.REACT_APP_LOCALE ||
  fallbackLng

const resources = {
  [languages.enGB]: {
    translation: en,
  },
  [languages.enUS]: {
    translation: en,
  },
  [languages.roRo]: {
    translation: ro,
  },
}

i18n.on("languageChanged", function (lang) {
  if (typeof window !== "undefined") {
    document.documentElement.lang = lang
  }
})

i18n.use(ICU).init({
  resources,
  lng,
  fallbackLng,
})

export default i18n
