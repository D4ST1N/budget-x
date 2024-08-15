import WalletCreation from "@/components/Wallet/WalletCreation.vue";
import WalletEditor from "@/components/Wallet/WalletEditor.vue";
import WalletJoin from "@/components/Wallet/WalletJoin.vue";
import WalletShare from "@/components/Wallet/WalletShare.vue";
import { useUserStore } from "@/store/user";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import StatisticView from "@/views/StatisticView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import WalletView from "@/views/WalletView.vue";
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

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
    path: "/profile",
    name: "Profile",
    component: UserProfileView,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/statistic",
    name: "Statistic",
    component: StatisticView,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: WalletView,
    children: [
      {
        path: "add",
        name: "AddWallet",
        component: WalletCreation,
        meta: {
          titleKey: "wallet.newWallet",
        },
      },
      {
        path: "edit",
        name: "EditWallet",
        component: WalletEditor,
        meta: {
          titleKey: "wallet.editWallet",
        },
      },
      {
        path: "share",
        name: "ShareWallet",
        component: WalletShare,
        meta: {
          titleKey: "wallet.shareWallet",
        },
      },
      {
        path: "join/:token",
        name: "JoinWallet",
        component: WalletJoin,
        meta: {
          titleKey: "wallet.joinWallet",
          showBackButton: false,
        },
      },
    ],
    meta: {
      authRequired: true,
      showBackButton: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();
  const { isVerificationNeeded } = storeToRefs(userStore);

  if (to.query.session_token) {
    localStorage.setItem("session_token", String(to.query.session_token));
    router.replace({ query: undefined });
  }

  const token = localStorage.getItem("session_token");
  const isLoginPage = to.name === "Login";

  if (isLoginPage) {
    if (token) {
      if (isVerificationNeeded.value) {
        const response = await userStore.verifyUser(token);

        if (response.success) {
          next("/");
          return;
        }

        next();
        return;
      }
    } else {
      next();
      return;
    }
  }

  const { authRequired } = to.meta;

  if (authRequired) {
    if (token) {
      if (isVerificationNeeded.value) {
        const response = await userStore.verifyUser(token);

        if (!response.success) {
          localStorage.removeItem("session_token");
          next("/login");
          return;
        }
      }
    } else {
      next("/login");
      return;
    }
  }

  next();
});

export default router;
