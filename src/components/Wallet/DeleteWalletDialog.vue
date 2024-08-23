<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["update:isOpen"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

function onDeleteClick() {
  walletStore.deleteWallet();
  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('wallet.removeWalletTitle')"
    title-icon="mdi-delete"
  >
    <v-card-text>
      {{ t("wallet.removeWalletMessage") }}
    </v-card-text>

    <template #actions>
      <v-btn variant="elevated" @click="showDialog = false">
        {{ t("ui.cancel") }}
      </v-btn>

      <v-btn variant="text" color="error" @click="onDeleteClick">
        {{ t("ui.delete") }}
      </v-btn>
    </template>
  </BaseDialog>
</template>
