<script setup lang="ts">
import WalletEditor from "@/components/Wallet/WalletEditor.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["update:isOpen"]);
const { t } = useI18n();

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('wallet.changeName')"
    title-icon="mdi-rename"
  >
    <WalletEditor @on-save="showDialog = false">
      <template #actions>
        <CloseButton @click="showDialog = false" />
      </template>
    </WalletEditor>
  </BaseDialog>
</template>
