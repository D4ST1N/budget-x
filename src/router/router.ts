import WalletCreation from "@/components/Wallet/WalletCreation.vue";
import WalletEditor from "@/components/Wallet/WalletEditor.vue";
import WalletJoin from "@/components/Wallet/WalletJoin.vue";
import { hasAccess } from "@/helpers/utils";
import { useUserStore } from "@/store/user";
import { useWalletStore } from "@/store/wallets";
import { AccessLevel } from "@/types/AccessLevel";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import StatisticView from "@/views/StatisticView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import WalletView from "@/views/WalletView.vue";
import { storeToRefs } from "pinia";
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";

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
          accessLevel: [AccessLevel.Edit, AccessLevel.Delete],
          accessOperator: "OR",
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
      {
        path: "categories",
        name: "Categories",
        component: () => import("@/components/Category/CategoriesList.vue"),
        meta: {
          titleKey: "category.categories",
          accessLevel: [AccessLevel.View],
        },
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/components/Users/UsersList.vue"),
        meta: {
          titleKey: "users.users",
          accessLevel: [AccessLevel.View],
        },
      },
    ],
    meta: {
      authRequired: true,
      showBackButton: true,
    },
  },
  {
    path: "/no-access",
    name: "NoAccess",
    component: () => import("@/views/AccessDeniedView.vue"),
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

async function checkAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<boolean> {
  const token = localStorage.getItem("session_token");

  if (to.meta.authRequired && !token) {
    localStorage.setItem("redirectAfterLogin", to.fullPath);
    next("/login");
    return false;
  }

  if (to.meta.authRequired && token) {
    const isLoginPage = to.name === "Login";

    if (isLoginPage) {
      return await verifyUser(
        token,
        () => {
          next("/");

          return true;
        },
        () => {
          next();

          return false;
        }
      );
    } else {
      return await verifyUser(
        token,
        () => {
          return true;
        },
        () => {
          localStorage.removeItem("session_token");
          localStorage.setItem("redirectAfterLogin", to.fullPath);
          next("/login");

          return false;
        }
      );
    }
  }

  return true;
}

async function verifyUser(
  token: string,
  success: () => boolean,
  failure: () => boolean
): Promise<boolean> {
  const userStore = useUserStore();
  const response = await userStore.verifyUser(token);

  if (response.success) {
    return success();
  }

  return failure();
}

router.beforeEach(async (to, from, next) => {
  if (to.query.session_token) {
    localStorage.setItem("session_token", String(to.query.session_token));
    const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
    localStorage.removeItem("redirectAfterLogin");
    router.replace({ path: redirectUrl, query: undefined });
  }

  await checkAuth(to, from, next);
  const isWalletPage = to.matched.some((record) => record.name === "Wallet");

  if (!isWalletPage || !to.meta.accessLevel) {
    next();
    return;
  }

  const walletStore = useWalletStore();

  await walletStore.waitForAccessLevelsLoaded();

  const { currentAccessLevel } = storeToRefs(walletStore);

  if (
    hasAccess(
      to.meta.accessLevel as AccessLevel[],
      currentAccessLevel.value,
      (to.meta.accessOperator as "OR" | "AND") || "AND"
    )
  ) {
    next();
  } else {
    next("/no-access");
  }
});

export default router;
