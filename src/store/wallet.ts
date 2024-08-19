import {
  addWalletCategoryUrl,
  addWalletTagUrl,
  addWalletUrl,
  deleteWalletCategoryUrl,
  deleteWalletTagUrl,
  deleteWalletUrl,
  deleteWalletUserUrl,
  getInvitationLinkUrl,
  getWalletCategoriesUrl,
  getWalletsUrl,
  getWalletTagsUrl,
  getWalletUsersUrl,
  updateWalletCategoryUrl,
  updateWalletTagUrl,
  updateWalletUrl,
  updateWalletUserUrl,
} from "@/helpers/serverUrls";
import { fetchUserAvatar } from "@/helpers/utils";
import { api } from "@/plugins/axios";
import i18n from "@/plugins/i18n";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { AccessLevel } from "@/types/AccessLevel";
import {
  Category,
  CategoryData,
  CategoryTreeElement,
  SuccessWalletCategoriesFetchResponse,
} from "@/types/Category";
import { InvitationOptions } from "@/types/Invitation";
import { NotificationType } from "@/types/Notification";
import { ServerResponse, ServerResponseError } from "@/types/ServerResponse";
import { SuccessWalletTagsFetchResponse, Tag, TagData } from "@/types/Tag";
import { UserData } from "@/types/User";
import {
  SuccessWalletCreationResponse,
  SuccessWalletFetchResponse,
  SuccessWalletShareResponse,
  SuccessWalletUsersFetchResponse,
  Wallet,
  WalletData,
} from "@/types/Wallet";
import { AxiosResponse } from "axios";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export const useWalletStore = defineStore(
  "wallets",
  () => {
    const wallets = ref<Wallet[]>([]);
    const sharedWallets = ref<Wallet[]>([]);
    const selectedWallet = ref<string | null>(null);
    const sharedUsers = ref<UserData[]>([]);
    const fetchingWalletUsers = ref<boolean>(false);
    const walletFetched = ref<boolean>(false);
    const categories = ref<Category[]>([]);
    const tags = ref<Tag[]>([]);

    const router = useRouter();

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const notificationStore = useNotificationStore();

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

    function selectWallet(walletId: string) {
      if (!allWallets.value.some((wallet) => wallet._id === walletId)) return;

      selectedWallet.value = walletId;
      fetchWalletCategories();
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

    async function fetchWallets() {
      if (!user.value) return;

      const response: AxiosResponse<
        SuccessWalletFetchResponse | ServerResponseError
      > = await api.get(getWalletsUrl(user.value!.user_id));

      if (response.data.success) {
        wallets.value = response.data.wallets;
        sharedWallets.value = response.data.sharedWallets;

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
          fetchWalletCategories();
          fetchWalletTags();
        }
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }

      walletFetched.value = true;
    }

    async function fetchWalletCategories() {
      if (!selectedWallet.value) return;

      const response: AxiosResponse<
        SuccessWalletCategoriesFetchResponse | ServerResponseError
      > = await api.get(getWalletCategoriesUrl(selectedWallet.value));

      if (response.data.success) {
        categories.value = response.data.categories;
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function fetchWalletTags() {
      if (!selectedWallet.value) return;

      const response: AxiosResponse<
        SuccessWalletTagsFetchResponse | ServerResponseError
      > = await api.get(getWalletTagsUrl(selectedWallet.value));

      if (response.data.success) {
        tags.value = response.data.tags;
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function createWallet(walletName: string) {
      const walletData: WalletData = {
        name: walletName,
        creator: user.value!.user_id,
        allowedUsers: [],
      };
      const response: AxiosResponse<
        SuccessWalletCreationResponse | ServerResponseError
      > = await api.post(addWalletUrl(), JSON.stringify(walletData));

      if (response.data.success) {
        fetchWallets();
        router.push({ name: "Home" });
        notificationStore.add({
          text: i18n.global.t("notification.walletAdded"),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function createCategory(categoryData: CategoryData) {
      if (!selectedWallet.value) return false;

      const response: AxiosResponse<ServerResponse> = await api.post(
        addWalletCategoryUrl(selectedWallet.value),
        JSON.stringify({
          ...categoryData,
          walletId: selectedWallet.value,
        })
      );

      if (response.data.success) {
        fetchWalletCategories();
        notificationStore.add({
          text: i18n.global.t("notification.categoryAdded", {
            categoryName: categoryData.name,
          }),
          type: NotificationType.Success,
        });

        return true;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return false;
    }

    async function updateCategory(
      updatedCategoryData: CategoryData,
      categoryId: string
    ) {
      if (!selectedWallet.value) return false;

      const response: AxiosResponse<ServerResponse> = await api.patch(
        updateWalletCategoryUrl(selectedWallet.value, categoryId),
        JSON.stringify(updatedCategoryData)
      );

      if (response.data.success) {
        fetchWalletCategories();
        notificationStore.add({
          text: i18n.global.t("notification.categoryUpdated", {
            categoryName: updatedCategoryData.name,
          }),
          type: NotificationType.Success,
        });

        return true;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return false;
    }

    async function deleteCategory(categoryId: string) {
      if (!selectedWallet.value) return false;

      const response: AxiosResponse<ServerResponse> = await api.delete(
        deleteWalletCategoryUrl(selectedWallet.value, categoryId)
      );

      if (response.data.success) {
        fetchWalletCategories();
        notificationStore.add({
          text: i18n.global.t("notification.categoryDeleted"),
          type: NotificationType.Success,
        });

        return true;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return false;
    }

    async function createTag(tagData: TagData) {
      if (!selectedWallet.value) return false;

      const response: AxiosResponse<ServerResponse> = await api.post(
        addWalletTagUrl(selectedWallet.value),
        JSON.stringify({
          ...tagData,
          walletId: selectedWallet.value,
        })
      );

      if (response.data.success) {
        fetchWalletTags();
        notificationStore.add({
          text: i18n.global.t("notification.tagAdded", {
            tagName: tagData.name,
          }),
          type: NotificationType.Success,
        });

        return true;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return false;
    }

    async function updateTag(updatedTag: TagData, tagId: string) {
      if (!selectedWallet.value) return false;

      const response: AxiosResponse<ServerResponse> = await api.patch(
        updateWalletTagUrl(selectedWallet.value, tagId),
        JSON.stringify(updatedTag)
      );

      if (response.data.success) {
        fetchWalletTags();
        notificationStore.add({
          text: i18n.global.t("notification.tagUpdated", {
            tagName: updatedTag.name,
          }),
          type: NotificationType.Success,
        });

        return true;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return false;
    }

    async function deleteTag(tagId: string) {
      if (!selectedWallet.value) return false;

      const response: AxiosResponse<ServerResponse> = await api.delete(
        deleteWalletTagUrl(selectedWallet.value, tagId)
      );

      if (response.data.success) {
        fetchWalletTags();
        notificationStore.add({
          text: i18n.global.t("notification.tagDeleted"),
          type: NotificationType.Success,
        });

        return true;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return false;
    }

    async function updateWalletName(updatedWallet: Wallet) {
      const response: AxiosResponse<
        SuccessWalletCreationResponse | ServerResponseError
      > = await api.patch(
        updateWalletUrl(updatedWallet._id),
        JSON.stringify(updatedWallet)
      );

      if (response.data.success) {
        await fetchWallets();
        router.push({ name: "Home" });
        notificationStore.add({
          text: i18n.global.t("notification.walletUpdated"),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function deleteWallet() {
      const response: AxiosResponse<ServerResponse> = await api.delete(
        deleteWalletUrl(currentWallet.value!._id)
      );

      if (response.data.success) {
        selectedWallet.value = null;
        fetchWallets();
        router.push({ name: "Home" });
        notificationStore.add({
          text: i18n.global.t("notification.walletDeleted"),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function shareWallet(invitationOptions: InvitationOptions) {
      const response: AxiosResponse<
        SuccessWalletShareResponse | ServerResponseError
      > = await api.post(
        getInvitationLinkUrl(currentWallet.value!._id),
        JSON.stringify(invitationOptions)
      );

      if (response.data.success) {
        return response.data.token;
      }

      notificationStore.add({
        text: i18n.global.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return null;
    }

    async function fetchWalletUsers() {
      if (!selectedWallet.value) return;
      fetchingWalletUsers.value = true;
      const response: AxiosResponse<
        SuccessWalletUsersFetchResponse | ServerResponseError
      > = await api.get(getWalletUsersUrl(selectedWallet.value!));

      if (response.data.success) {
        sharedUsers.value = await Promise.all(
          response.data.users.map(async (user) => {
            user.providers[0].profile_picture_url = (await fetchUserAvatar(
              user
            )) as string;

            return user;
          })
        );
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }

      fetchingWalletUsers.value = false;
    }

    async function editWalletUser(userId: string, accessLevels: AccessLevel[]) {
      if (!selectedWallet.value) return;

      const response: AxiosResponse<ServerResponse> = await api.patch(
        updateWalletUserUrl(selectedWallet.value, userId),
        JSON.stringify(accessLevels)
      );

      if (response.data.success) {
        fetchWallets();
        notificationStore.add({
          text: i18n.global.t(`notification.userEdited`),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function deleteWalletUser(userId: string) {
      const response: AxiosResponse<ServerResponse> = await api.delete(
        deleteWalletUserUrl(selectedWallet.value!, userId)
      );

      if (response.data.success) {
        notificationStore.add({
          text: i18n.global.t(`notification.userRemoved`),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.global.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
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

    return {
      wallets,
      sharedWallets,
      sharedUsers,
      selectedWallet,
      currentWallet,
      currentAccessLevel,
      fetchingWalletUsers,
      categories,
      rootCategories,
      categoriesTree,
      tags,
      selectWallet,
      waitForAccessLevelsLoaded,
      fetchWallets,
      fetchWalletCategories,
      fetchWalletTags,
      createWallet,
      createCategory,
      updateCategory,
      deleteCategory,
      createTag,
      updateTag,
      deleteTag,
      updateWalletName,
      deleteWallet,
      shareWallet,
      fetchWalletUsers,
      editWalletUser,
      deleteWalletUser,
      getUserAccess,
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
