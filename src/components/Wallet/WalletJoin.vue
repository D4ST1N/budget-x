<script setup lang="ts">
import { getInvitationInfoUrl, joinWalletUrl } from "@/helpers/serverUrls";
import { fetchUserAvatar } from "@/helpers/utils";
import { api } from "@/plugins/axios";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import { ServerResponseError } from "@/types/ServerResponse";
import { UserData } from "@/types/User";
import { SuccessInvitationInfoResponse } from "@/types/Wallet";
import { AxiosResponse } from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();
const notificationStore = useNotificationStore();
const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const loading = ref<boolean>(false);
const showHomeButton = ref<boolean>(false);
const walletName = ref<string>("");
const creator = ref<UserData | null>(null);
const creatorAvatar = ref<string | null>(null);

const token: string = router.currentRoute.value.params.token as string;
let notificationId: string = "";

fetchInvitationInfo();

onBeforeRouteLeave(() => {
  if (notificationId) {
    notificationStore.remove(notificationId);
  }
});

async function fetchInvitationInfo() {
  try {
    const response: AxiosResponse<
      SuccessInvitationInfoResponse | ServerResponseError
    > = await api.get(getInvitationInfoUrl(token));
    loading.value = false;

    if (response.data.success) {
      walletName.value = response.data.walletName;
      creator.value = response.data.creator;
      creatorAvatar.value = await fetchUserAvatar(response.data.creator);
    } else {
      notificationId = notificationStore.add({
        text: t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
        timeout: -1,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function tryToJoin() {
  loading.value = true;
  try {
    const response = await api.post(joinWalletUrl(token), {
      userId: user.value?.user_id,
    });
    loading.value = false;

    if (response.data.success) {
      notificationId = notificationStore.add({
        text: t("notification.walletJoined"),
        type: NotificationType.Success,
      });
    } else {
      notificationId = notificationStore.add({
        text: t(`errors.${response.data.errorType}`),
        type: NotificationType.Error,
        timeout: -1,
      });
    }
    showHomeButton.value = true;
  } catch (error) {
    console.error(error);
  }
}

function goToHome() {
  router.push({ name: "Home" });
}
</script>

<template>
  <v-card-text>
    <v-btn v-if="showHomeButton" variant="text" @click="goToHome">
      <template #prepend>
        <v-icon>mdi-home</v-icon>
      </template>
      {{ t("ui.goHome") }}
    </v-btn>

    <template v-else>
      <v-list v-if="creator" class="mb-3">
        <v-list-item
          :key="creator.user_id"
          :title="`${creator.name.first_name} ${creator.name.last_name}`"
        >
          <template #prepend>
            <v-avatar color="grey-lighten-1">
              <v-img alt="avatar" :src="creatorAvatar || ''"></v-img>
            </v-avatar>
          </template>
        </v-list-item>

        <v-list-subheader>
          {{ t("wallet.joiningWallet") }}
        </v-list-subheader>

        <v-list-item>
          <v-list-item-title>
            <v-icon class="mr-2">mdi-wallet</v-icon>
            {{ walletName }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-btn variant="text" @click="tryToJoin">
        <template #prepend>
          <v-icon>mdi-wallet-plus</v-icon>
        </template>

        {{ t("wallet.joinWallet") }}
      </v-btn>
    </template>

    <div v-if="loading">
      <v-progress-linear color="primary" indeterminate></v-progress-linear>
    </div>
  </v-card-text>
</template>
