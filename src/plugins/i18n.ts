import { createI18n } from "vue-i18n";
import { en, ua } from "@/i18n";

const messages = {
  en,
  ua,
};

const i18n = createI18n({
  legacy: false,
  locale: "ua",
  fallbackLocale: "en",
  messages,
});

export default i18n;
