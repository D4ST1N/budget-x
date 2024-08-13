<script setup lang="ts">
import { joinWallet } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRouter } from "vue-router";

const router = useRouter();
const i18n = useI18n();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const loading = ref<boolean>(false);
const showHomeButton = ref<boolean>(false);

const token: string = router.currentRoute.value.params.token as string;
let notificationId: string = "";

onBeforeRouteLeave(() => {
  if (notificationId) {
    notificationStore.remove(notificationId);
  }
});

async function tryToJoin() {
  loading.value = true;
  try {
    const response = await api.post(joinWallet(token), {
      userId: user.value?.user_id,
    });
    loading.value = false;

    if (response.data.success) {
      notificationId = notificationStore.add({
        text: i18n.t("notification.walletJoined"),
        type: NotificationType.Success,
      });
    } else {
      notificationId = notificationStore.add({
        text: i18n.t(`errors.${response.data.errorType}`),
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
      {{ $t("ui.goHome") }}
    </v-btn>

    <v-btn v-else variant="text" @click="tryToJoin">
      <template #prepend>
        <v-icon>mdi-wallet-plus</v-icon>
      </template>
      {{ $t("wallet.joinWallet") }}
    </v-btn>

    <div v-if="loading">
      <v-progress-linear color="primary" indeterminate></v-progress-linear>
    </div>
  </v-card-text>
</template>
