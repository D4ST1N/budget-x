import { createWebHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import StatisticView from "@/views/StatisticView.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
    name: "Home",
  },
  {
    path: "/statistic",
    component: StatisticView,
    name: "Statistic",
  },
];

const router = createRouter({
  history: createWebHistory("budget-x"),
  routes,
});

export default router;
