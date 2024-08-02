import { createWebHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import StatisticView from "@/views/StatisticView.vue";
import LoginView from "@/views/LoginView.vue";

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
  if (to.query.session_token) {
    localStorage.setItem("session_token", String(to.query.session_token));
    router.replace({ query: undefined });
  }

  const token = localStorage.getItem("session_token");

  if (to.matched.some((record) => record.meta.authRequired)) {
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      const parsedResponse = (await response.json()) as { success: boolean };

      if (!parsedResponse.success) {
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
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      const parsedResponse = (await response.json()) as { success: boolean };

      if (parsedResponse.success) {
        next("/");
      }
    }
  }

  next();
});

export default router;
