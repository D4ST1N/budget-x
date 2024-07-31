import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { md3 } from "vuetify/blueprints";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md3,
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
          primary: "#8A4FFF",
          secondary: "#FFBF69",
          surface: "#3A2D32",
          background: "#171214",
        },
      },
    },
  },
});

export default vuetify;
