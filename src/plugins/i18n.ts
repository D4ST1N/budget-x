import { en, ua } from "@/i18n";
import { createI18n } from "vue-i18n";

const numberFormats: Record<
  string,
  Record<string, Intl.NumberFormatOptions>
> = {
  en: {
    currency: {
      style: "currency",
      currency: "UAH",
    },
  },
  ua: {
    currency: {
      style: "currency",
      currency: "UAH",
    },
  },
};

const messages = {
  en,
  ua,
};

const i18n = createI18n({
  legacy: false,
  locale: "ua",
  fallbackLocale: "ua",
  numberFormats,
  messages,
});

export default i18n;
