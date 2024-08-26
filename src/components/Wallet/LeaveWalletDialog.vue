<script setup lang="ts">
import { handleServerError } from "@/helpers/handleServerError";
import { leaveWalletUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { useWalletStore } from "@/store/wallet";
import { ServerResponseError } from "@/types/ServerResponse";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["update:isOpen"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { currentWallet } = storeToRefs(walletStore);

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

async function onLeaveClick() {
  if (!currentWallet.value) {
    return;
  }

  try {
    await api.get(leaveWalletUrl(currentWallet.value._id));
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }

  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('wallet.leaveWalletTitle')"
    title-icon="mdi-delete"
  >
    <v-card-text>
      {{ t("wallet.leaveWalletText") }}
    </v-card-text>

    <template #actions>
      <v-btn variant="elevated" @click="showDialog = false">
        {{ t("ui.cancel") }}
      </v-btn>

      <v-btn variant="text" color="error" @click="onLeaveClick">
        {{ t("ui.leave") }}
      </v-btn>
    </template>
  </BaseDialog>
</template>
