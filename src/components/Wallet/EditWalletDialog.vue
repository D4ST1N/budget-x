<script setup lang="ts">
import WalletEditor from "@/components/Wallet/WalletEditor.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

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
  <v-dialog v-model="showDialog" width="400">
    <v-card
      max-width="400"
      prepend-icon="mdi-rename"
      :title="t('wallet.changeName')"
    >
      <template #default>
        <WalletEditor @on-save="showDialog = false">
          <template #actions>
            <v-btn variant="text" @click="showDialog = false">
              {{ t("ui.cancel") }}
            </v-btn>
          </template>
        </WalletEditor>
      </template>
    </v-card>
  </v-dialog>
</template>
