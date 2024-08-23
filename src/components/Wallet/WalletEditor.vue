<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { Wallet } from "@/types/Wallet";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["on-save"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { currentWallet, currentAccessLevel } = storeToRefs(walletStore);
const newWallet = ref({ ...currentWallet.value });
const valid = ref<boolean>(false);

const requiredField = required();

const editAvailable = computed(() =>
  hasAccess([AccessLevel.Update], currentAccessLevel.value)
);

const isChanged = computed(
  () => JSON.stringify(currentWallet.value) !== JSON.stringify(newWallet.value)
);

function updateWallet() {
  walletStore.updateWallet(newWallet.value as Wallet);
  emit("on-save");
}
</script>

<template>
  <v-card-text :class="$style.pageContainer">
    <v-form
      v-model="valid"
      :class="$style.editForm"
      @submit.prevent="updateWallet"
    >
      <v-text-field
        v-model="newWallet.name"
        :label="t('wallet.walletName')"
        hide-details="auto"
        :readonly="!editAvailable"
        :rules="[requiredField]"
      ></v-text-field>

      <br />

      <div :class="$style.actions">
        <v-btn
          v-if="editAvailable"
          :disabled="!valid || !isChanged"
          type="submit"
          variant="elevated"
          color="primary"
        >
          {{ t("ui.save") }}
        </v-btn>
        <slot name="actions" />
      </div>
    </v-form>
  </v-card-text>
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
