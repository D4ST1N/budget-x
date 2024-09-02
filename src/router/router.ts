import WalletCreation from "@/components/Wallet/WalletCreation.vue";
import WalletEditor from "@/components/Wallet/WalletEditor.vue";
import WalletJoin from "@/components/Wallet/WalletJoin.vue";
import { AccessLevel } from "@/types/AccessLevel";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import StatisticView from "@/views/StatisticView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import WalletView from "@/views/WalletView.vue";
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
          accessLevel: [AccessLevel.Update],
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
      {
        path: "tags",
        name: "Tags",
        component: () => import("@/components/Tag/TagsList.vue"),
        meta: {
          titleKey: "tag.tags",
          accessLevel: [AccessLevel.View],
        },
      },
      {
        path: "expense",
        name: "ExpenseCreation",
        component: () => import("@/components/Expense/ExpenseCreation.vue"),
        meta: {
          titleKey: "expense.newExpense",
          accessLevel: [AccessLevel.CreateExpense],
        },
      },
      {
        path: "income",
        name: "IncomeCreation",
        component: () => import("@/components/Expense/IncomeCreation.vue"),
        meta: {
          titleKey: "income.newIncome",
          accessLevel: [AccessLevel.CreateExpense],
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

export default router;
