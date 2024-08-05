import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import vuetify from "@/plugins/vuetify";
import router from "@/router/router";
import i18n from "@/plugins/i18n";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(vuetify).use(i18n).mount("#app");
