import {
  addWallet,
  deleteWallet as deleteWalletUrl,
  getInvite,
  getWallets,
  getWalletUsers,
  removeWalletUser,
  updateWallet,
} from "@/helpers/serverUrls";
import { fetchUserAvatar } from "@/helpers/utils";
import { api } from "@/plugins/axios";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import { ServerResponse, ServerResponseError } from "@/types/ServerResponse";
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
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export const useWalletStore = defineStore(
  "wallets",
  () => {
    const wallets = ref<Wallet[]>([]);
    const sharedWallets = ref<Wallet[]>([]);
    const selectedWallet = ref<string | null>(null);
    const sharedUsers = ref<UserData[]>([]);
    const fetchingWalletUsers = ref<boolean>(false);

    const i18n = useI18n();
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

    async function fetchWallets() {
      const response: AxiosResponse<
        SuccessWalletFetchResponse | ServerResponseError
      > = await api.get(getWallets(user.value!.user_id));

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
      } else {
        notificationStore.add({
          text: i18n.t(`errors.${response.data.errorType}`),
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
      > = await api.post(addWallet(), JSON.stringify(walletData));

      if (response.data.success) {
        fetchWallets();
        router.push({ name: "Home" });
        notificationStore.add({
          text: i18n.t("notification.walletAdded"),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function updateWalletName(updatedWallet: Wallet) {
      const response: AxiosResponse<
        SuccessWalletCreationResponse | ServerResponseError
      > = await api.patch(
        updateWallet(updatedWallet._id),
        JSON.stringify(updatedWallet)
      );

      if (response.data.success) {
        await fetchWallets();
        router.push({ name: "Home" });
        notificationStore.add({
          text: i18n.t("notification.walletUpdated"),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.t(`errors.${response.data.errorType}`),
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
          text: i18n.t("notification.walletDeleted"),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    async function shareWallet() {
      const linkOptions = {
        maxUses: 1,
        expiresIn: 2 * 60 * 60 * 1000,
      };
      const response: AxiosResponse<
        SuccessWalletShareResponse | ServerResponseError
      > = await api.post(
        getInvite(currentWallet.value!._id),
        JSON.stringify(linkOptions)
      );

      if (response.data.success) {
        return response.data.token;
      }

      notificationStore.add({
        text: i18n.t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
      });

      return null;
    }

    async function fetchWalletUsers() {
      if (!selectedWallet.value) return;
      fetchingWalletUsers.value = true;
      const response: AxiosResponse<
        SuccessWalletUsersFetchResponse | ServerResponseError
      > = await api.get(getWalletUsers(selectedWallet.value!));

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
          text: i18n.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }

      fetchingWalletUsers.value = false;
    }

    async function deleteWalletUser(userId: string) {
      const response: AxiosResponse<ServerResponse> = await api.delete(
        removeWalletUser(selectedWallet.value!, userId)
      );

      if (response.data.success) {
        notificationStore.add({
          text: i18n.t(`notification.userRemoved`),
          type: NotificationType.Success,
        });
      } else {
        notificationStore.add({
          text: i18n.t(`errors.${response.data.errorType}`),
          type: NotificationType.Error,
        });
      }
    }

    return {
      wallets,
      sharedWallets,
      sharedUsers,
      selectedWallet,
      currentWallet,
      fetchingWalletUsers,
      fetchWallets,
      createWallet,
      updateWalletName,
      deleteWallet,
      shareWallet,
      fetchWalletUsers,
      deleteWalletUser,
    };
  },
  {
    persist: {
      paths: ["selectedWallet"],
      afterRestore: async ({ store }) => {
        await store.fetchWallets();
        await store.fetchWalletUsers();
      },
    },
  }
);
