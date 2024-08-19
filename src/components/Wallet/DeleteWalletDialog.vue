<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["update:isOpen"]);

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
  <v-dialog v-model="showDialog" width="400">
    <v-card
      max-width="400"
      prepend-icon="mdi-delete"
      :title="$t('wallet.removeWalletTitle')"
      :text="$t('wallet.removeWalletMessage')"
    >
      <template #actions>
        <v-btn variant="text" color="error" @click="onDeleteClick">
          {{ $t("ui.delete") }}
        </v-btn>

        <v-btn variant="elevated" @click="showDialog = false">
          {{ $t("ui.cancel") }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
