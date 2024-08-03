import { createWebHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import StatisticView from "@/views/StatisticView.vue";
import LoginView from "@/views/LoginView.vue";
import { useUserStore } from "@/store/user";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/statistic",
    name: "Statistic",
    component: StatisticView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory("budget-x"),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();

  if (to.query.session_token) {
    localStorage.setItem("session_token", String(to.query.session_token));
    router.replace({ query: undefined });
  }

  const token = localStorage.getItem("session_token");

  if (to.matched.some((record) => record.meta.authRequired)) {
    if (token) {
      const response = await userStore.verifyUser(token);

      if (!response.success) {
        localStorage.removeItem("session_token");
        next("/login");
        return;
      }
    } else {
      next("/login");
      return;
    }
  } else if (to.matched.some((record) => record.name === "Login")) {
    if (token) {
      const response = await userStore.verifyUser(token);

      if (response.success) {
        next("/");
      }
    }
  }

  next();
});

export default router;
