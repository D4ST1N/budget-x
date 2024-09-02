import "@mdi/font/css/materialdesignicons.css";
import { useI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import { md2 } from "vuetify/blueprints";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import "vuetify/styles";
import i18n from "./i18n";

const vuetify = createVuetify({
  components: {
    VNumberInput,
    ...components,
  },
  directives,
  blueprint: md2,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          primary: "#FFBF69",
          secondary: "#8A4FFF",
          surface: "#3A2D32",
          background: "#171214",
        },
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});

export default vuetify;
