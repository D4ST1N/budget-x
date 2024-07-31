import { createApp } from "vue";
import "./style.css";
import vuetify from "@/plugins/vuetify";
import router from "@/router/router";
import App from "./App.vue";

createApp(App).use(router).use(vuetify).mount("#app");
