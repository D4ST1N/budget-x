import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import vuetify from "@/plugins/vuetify";
import router from "@/router/router";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(vuetify).mount("#app");
