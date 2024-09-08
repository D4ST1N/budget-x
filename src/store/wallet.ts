import { fetchUserAvatar } from "@/helpers/utils";
import i18n from "@/plugins/i18n";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { AccessLevel } from "@/types/AccessLevel";
import { Category, CategoryData, CategoryTreeElement } from "@/types/Category";
import { ExpenseData, ExpensesData } from "@/types/Expense";
import { InvitationOptions } from "@/types/Invitation";
import { NotificationType } from "@/types/Notification";
import { Tag, TagData } from "@/types/Tag";
import { UserData } from "@/types/User";
import { Wallet } from "@/types/Wallet";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import {
  createCategoryAction,
  createExpenseAction,
  createInvitationLinkAction,
  createTagAction,
  createTagsAction,
  createWalletAction,
  deleteCategoryAction,
  deleteExpenseAction,
  deleteTagAction,
  deleteWalletAction,
  deleteWalletUserAction,
  ExpensesFilters,
  fetchCategoriesAction,
  fetchExpensesAction,
  fetchTagsAction,
  fetchWalletsAction,
  fetchWalletUsersAction,
  updateCategoryAction,
  updateExpenseAction,
  updateTagAction,
  updateWalletAction,
  updateWalletUserAction,
} from "./walletActions";
import { createExpensesBulkAction } from "./walletActions/createExpensesBulkAction";

export const useWalletStore = defineStore(
  "wallets",
  () => {
    const router = useRouter();
    const userStore = useUserStore();
    const notificationStore = useNotificationStore();

    const { user } = storeToRefs(userStore);
    const wallets = ref<Wallet[]>([]);
    const sharedWallets = ref<Wallet[]>([]);
    const selectedWallet = ref<string | null>(null);
    const sharedUsers = ref<UserData[]>([]);
    const fetchingWalletUsers = ref<boolean>(false);
    const walletFetched = ref<boolean>(false);
    const categoriesFetched = ref<boolean>(false);
    const categories = ref<Category[]>([]);
    const tags = ref<Tag[]>([]);

    const currentWallet = computed(() => {
      if (!selectedWallet.value) return null;

      return [...wallets.value, ...sharedWallets.value].find(
        (wallet) => wallet._id === selectedWallet.value
      );
    });

    const currentAccessLevel = computed(() => {
      if (!currentWallet.value || !user.value) return [];

      if (currentWallet.value.creator === user.value.user_id) {
        return Object.values(AccessLevel);
      }

      const allowedUser = currentWallet.value.allowedUsers.find(
        (u) => u.userId === user.value!.user_id
      );

      if (allowedUser) {
        return allowedUser.accessLevels;
      }

      return [];
    });

    const isSharedWallet = computed(() => {
      if (!currentWallet.value || !user.value) return false;

      return currentWallet.value.creator !== user.value.user_id;
    });

    const allWallets = computed(() => [
      ...wallets.value,
      ...sharedWallets.value,
    ]);

    const rootCategories = computed(() => {
      return categories.value.filter((category) => !category.parentCategory);
    });

    const categoriesTree = computed(() => {
      const categoryMap = new Map<string, CategoryTreeElement>();

      categories.value.forEach((category) => {
        categoryMap.set(category._id, { ...category, subCategories: [] });
      });

      const rootCategories: CategoryTreeElement[] = [];

      categoryMap.forEach((category) => {
        if (category.parentCategory) {
          const parentCategory = categoryMap.get(category.parentCategory);
          parentCategory?.subCategories.push(category);
        } else {
          rootCategories.push(category);
        }
      });

      return rootCategories;
    });

    function categoryById(categoryId: string): Category | undefined {
      return categories.value.find((category) => category._id === categoryId);
    }

    function selectWallet(walletId: string) {
      if (!allWallets.value.some((wallet) => wallet._id === walletId)) return;

      selectedWallet.value = walletId;
      fetchCategories();
      fetchWalletTags();
    }

    function waitForAccessLevelsLoaded(): Promise<void> {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (walletFetched.value && user.value) {
            resolve();
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    function waitForCategoriesLoaded(): Promise<void> {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (categoriesFetched.value) {
            resolve();
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    function setWallets(walletsData: Wallet[]) {
      wallets.value = walletsData;
    }

    async function fetchWallets() {
      const walletsData = await fetchWalletsAction();

      if (!walletsData) return;

      wallets.value = walletsData.wallets;
      sharedWallets.value = walletsData.sharedWallets;

      const allWallets = [...wallets.value, ...sharedWallets.value];
      const hasAccessToSelectedWallet = allWallets.some(
        (wallet: Wallet) => wallet._id === selectedWallet.value
      );

      if (!hasAccessToSelectedWallet) {
        selectedWallet.value = null;
      }

      if (!selectedWallet.value && allWallets.length > 0) {
        selectedWallet.value = allWallets[0]._id;
      }

      if (selectedWallet.value) {
        fetchCategories();
        fetchWalletTags();
      }

      walletFetched.value = true;
    }

    async function fetchCategories() {
      if (!selectedWallet.value) return;

      const categoriesData = await fetchCategoriesAction({
        walletId: selectedWallet.value,
      });

      if (!categoriesData) return;

      categories.value = categoriesData.categories;
      categoriesFetched.value = true;
    }

    async function fetchWalletTags() {
      if (!selectedWallet.value) return;

      const tagsData = await fetchTagsAction({
        walletId: selectedWallet.value,
      });

      if (!tagsData) return;

      tags.value = tagsData.tags;
    }

    async function createWallet(walletName: string) {
      const walletData = await createWalletAction({
        walletName: walletName,
        userId: user.value!.user_id,
      });

      if (!walletData) return;

      await fetchWallets();

      selectWallet(walletData.walletId);
      router.push({ name: "Home" });

      notificationStore.add({
        text: i18n.global.t("notification.walletAdded"),
        type: NotificationType.Success,
      });
    }

    async function createCategory(categoryData: CategoryData) {
      if (!selectedWallet.value) return null;

      const createdCategoryData = await createCategoryAction({
        walletId: selectedWallet.value,
        categoryData,
      });

      if (!createdCategoryData) return null;

      await fetchCategories();
      notificationStore.add({
        text: i18n.global.t("notification.categoryAdded", {
          categoryName: createdCategoryData.category.name,
        }),
        type: NotificationType.Success,
      });

      return createdCategoryData;
    }

    async function updateCategory(
      categoryData: CategoryData,
      categoryId: string
    ) {
      if (!selectedWallet.value) return false;

      const updatedCategoryData = await updateCategoryAction({
        walletId: selectedWallet.value,
        categoryId,
        categoryData,
      });

      if (!updatedCategoryData) return false;

      await fetchCategories();
      notificationStore.add({
        text: i18n.global.t("notification.categoryUpdated", {
          categoryName: updatedCategoryData.category.name,
        }),
        type: NotificationType.Success,
      });

      return true;
    }

    async function deleteCategory(categoryId: string) {
      if (!selectedWallet.value) return false;

      const result = await deleteCategoryAction({
        walletId: selectedWallet.value,
        categoryId,
      });

      if (!result) return false;

      await fetchCategories();
      notificationStore.add({
        text: i18n.global.t("notification.categoryDeleted"),
        type: NotificationType.Success,
      });

      return true;
    }

    async function createTag(tagData: TagData) {
      if (!selectedWallet.value) return false;

      const createdTagData = await createTagAction({
        walletId: selectedWallet.value,
        tagData,
      });

      if (!createdTagData) return false;

      await fetchWalletTags();
      notificationStore.add({
        text: i18n.global.t("notification.tagAdded", {
          tagName: createdTagData.tag.name,
        }),
        type: NotificationType.Success,
      });

      return true;
    }

    async function createTags(tagNames: string[]) {
      if (!selectedWallet.value) return null;

      const existingTags = tags.value.filter((tag) =>
        tagNames.includes(tag.name)
      );

      if (existingTags.length === tagNames.length) {
        return existingTags;
      }

      const createdTagsData = await createTagsAction({
        walletId: selectedWallet.value,
        tags: tagNames,
      });

      if (!createdTagsData) return null;

      await fetchWalletTags();
      notificationStore.add({
        text: i18n.global.t("notification.tagsAdded"),
        type: NotificationType.Success,
      });

      return [...createdTagsData.createdTags, ...createdTagsData.existingTags];
    }

    async function updateTag(tagData: TagData, tagId: string) {
      if (!selectedWallet.value) return false;

      const updatedTagData = await updateTagAction({
        walletId: selectedWallet.value,
        tagId,
        tagData,
      });

      if (!updatedTagData) return false;

      await fetchWalletTags();
      notificationStore.add({
        text: i18n.global.t("notification.tagUpdated", {
          tagName: updatedTagData.tag.name,
        }),
        type: NotificationType.Success,
      });

      return true;
    }

    async function deleteTag(tagId: string) {
      if (!selectedWallet.value) return false;

      const successDeletion = await deleteTagAction({
        walletId: selectedWallet.value,
        tagId,
      });

      if (!successDeletion) return false;

      await fetchWalletTags();
      notificationStore.add({
        text: i18n.global.t("notification.tagDeleted"),
        type: NotificationType.Success,
      });

      return true;
    }

    async function updateWallet(updatedWallet: Wallet) {
      if (!currentWallet.value) return;

      const updatedWalletData = await updateWalletAction({
        walletId: updatedWallet._id,
        walletData: updatedWallet,
      });

      if (!updatedWalletData) return;

      await fetchWallets();
      notificationStore.add({
        text: i18n.global.t("notification.walletUpdated"),
        type: NotificationType.Success,
      });
    }

    async function deleteWallet() {
      if (!currentWallet.value) return;

      const deleteResult = await deleteWalletAction({
        walletId: currentWallet.value._id,
      });

      if (!deleteResult) return;

      selectedWallet.value = null;
      await fetchWallets();
      router.push({ name: "Home" });
      notificationStore.add({
        text: i18n.global.t("notification.walletDeleted"),
        type: NotificationType.Success,
      });
    }

    async function createInvitationLink(invitationOptions: InvitationOptions) {
      if (!selectedWallet.value) return null;

      const invitationToken = await createInvitationLinkAction({
        walletId: selectedWallet.value,
        invitationOptions,
      });

      if (!invitationToken) return null;

      return invitationToken;
    }

    async function fetchWalletUsers() {
      if (!selectedWallet.value) return;

      fetchingWalletUsers.value = true;

      const walletUsersData = await fetchWalletUsersAction({
        walletId: selectedWallet.value,
      });

      if (!walletUsersData) return;

      sharedUsers.value = await Promise.all(
        walletUsersData.users.map(async (user) => {
          user.providers[0].profile_picture_url = (await fetchUserAvatar(
            user
          )) as string;

          return user;
        })
      );

      fetchingWalletUsers.value = false;
    }

    async function updateWalletUser(
      userId: string,
      accessLevels: AccessLevel[]
    ) {
      if (!selectedWallet.value) return;

      const updateSuccess = await updateWalletUserAction({
        walletId: selectedWallet.value,
        userId,
        accessLevels,
      });

      if (!updateSuccess) return;

      await fetchWallets();
      notificationStore.add({
        text: i18n.global.t(`notification.userEdited`),
        type: NotificationType.Success,
      });
    }

    async function deleteWalletUser(userId: string) {
      if (!selectedWallet.value) return;

      const deleteSuccess = await deleteWalletUserAction({
        walletId: selectedWallet.value,
        userId,
      });

      if (!deleteSuccess) return;

      fetchWallets();
      notificationStore.add({
        text: i18n.global.t(`notification.userRemoved`),
        type: NotificationType.Success,
      });
    }

    function getUserAccess(userId: string): AccessLevel[] {
      if (!currentWallet.value) return [];

      const allowedUser = currentWallet.value.allowedUsers.find(
        (u) => u.userId === userId
      );

      if (allowedUser) {
        return allowedUser.accessLevels;
      }

      return [];
    }

    async function createExpense(expenseData: ExpenseData) {
      if (!selectedWallet.value) return;

      const createdExpenseData = await createExpenseAction({
        walletId: selectedWallet.value,
        expenseData,
      });

      if (!createdExpenseData) return;

      notificationStore.add({
        text: i18n.global.t("notification.expenseAdded"),
        type: NotificationType.Success,
      });
    }

    async function createExpensesBulk(expenses: ExpenseData[]) {
      if (!selectedWallet.value) return;

      const createdExpensesData = await createExpensesBulkAction({
        walletId: selectedWallet.value,
        expenses,
      });

      if (!createdExpensesData) return;

      notificationStore.add({
        text: i18n.global.t("notification.expensesAdded"),
        type: NotificationType.Success,
      });
    }

    async function fetchExpenses(
      filters: ExpensesFilters = {}
    ): Promise<ExpensesData | null> {
      if (!selectedWallet.value) return null;

      const expensesData = await fetchExpensesAction({
        walletId: selectedWallet.value,
        filters,
      });

      if (!expensesData) return null;

      return expensesData;
    }

    async function updateExpense(expenseData: ExpenseData, expenseId: string) {
      if (!selectedWallet.value) return;

      const updatedExpense = await updateExpenseAction({
        walletId: selectedWallet.value,
        expenseId,
        expense: expenseData,
      });

      if (!updatedExpense) return;

      notificationStore.add({
        text: i18n.global.t("notification.expenseUpdated"),
        type: NotificationType.Success,
      });
    }

    async function deleteExpense(expenseId: string) {
      if (!selectedWallet.value) return;

      const deleteSuccess = await deleteExpenseAction({
        walletId: selectedWallet.value,
        expenseId,
      });

      if (!deleteSuccess) return;

      notificationStore.add({
        text: i18n.global.t("notification.expenseDeleted"),
        type: NotificationType.Success,
      });
    }

    function getCategoryById(categoryId: string): Category | undefined {
      return categories.value.find((category) => category._id === categoryId);
    }

    return {
      wallets,
      sharedWallets,
      allWallets,
      sharedUsers,
      selectedWallet,
      currentWallet,
      currentAccessLevel,
      fetchingWalletUsers,
      categories,
      rootCategories,
      categoriesTree,
      tags,
      isSharedWallet,
      categoryById,
      selectWallet,
      waitForAccessLevelsLoaded,
      waitForCategoriesLoaded,
      setWallets,
      fetchWallets,
      fetchCategories,
      fetchWalletTags,
      createWallet,
      createCategory,
      updateCategory,
      deleteCategory,
      createTag,
      createTags,
      updateTag,
      deleteTag,
      updateWallet,
      deleteWallet,
      createInvitationLink,
      fetchWalletUsers,
      updateWalletUser,
      deleteWalletUser,
      getUserAccess,
      createExpense,
      createExpensesBulk,
      fetchExpenses,
      updateExpense,
      deleteExpense,
      getCategoryById,
    };
  },
  {
    persist: {
      paths: ["selectedWallet"],
      afterRestore: async ({ store }) => {
        await store.fetchWallets();
      },
    },
  }
);
