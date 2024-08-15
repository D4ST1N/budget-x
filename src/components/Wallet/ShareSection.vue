<script setup lang="ts">
import { useNotificationStore } from "@/store/notification";
import { useWalletStore } from "@/store/wallets";
import { InvitationOptions } from "@/types/Invitation";
import { NotificationType } from "@/types/Notification";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ShareLinkDialog from "../ShareLinkDialog/ShareLinkDialog.vue";

const i18n = useI18n();

const notificationStore = useNotificationStore();
const walletsStore = useWalletStore();
const shareLink = ref<string>("");

async function generateShareToken(invitationOptions: InvitationOptions) {
  const token = await walletsStore.shareWallet(invitationOptions);

  if (token) {
    const baseAppUrl = new URL(import.meta.env.BASE_URL, import.meta.url).href;
    shareLink.value = `${baseAppUrl}wallet/join/${token}`;
  }
}

async function copyClick() {
  try {
    await navigator.clipboard.writeText(shareLink.value);

    notificationStore.add({
      text: i18n.t("notification.textCopied"),
      type: NotificationType.Success,
    });
  } catch (error) {
    notificationStore.add({
      text: i18n.t("notification.textCopyFailed"),
      type: NotificationType.Error,
    });
  }
}
</script>

<template>
  <ShareLinkDialog @submit="generateShareToken" />

  <div v-if="shareLink" :class="$style.fieldWrapper">
    <v-text-field
      :value="shareLink"
      density="compact"
      variant="solo"
      append-icon="mdi-content-copy"
      readonly
      @click:append="copyClick"
    ></v-text-field>
  </div>
</template>

<style lang="scss" module>
.fieldWrapper {
  padding: 0 8px;
  margin-top: 8px;
}
</style>
