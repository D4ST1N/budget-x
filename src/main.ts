import i18n from "@/plugins/i18n";
import pinia from "@/plugins/pinia";
import vuetify from "@/plugins/vuetify";
import router from "@/router/router";
import HighchartsVue from "highcharts-vue";
import { createApp } from "vue";

import App from "./App.vue";

import "./style.css";

const app = createApp(App);

app
  .use(pinia)
  .use(router)
  .use(vuetify)
  .use(i18n)
  .use(HighchartsVue)
  .mount("#app");
