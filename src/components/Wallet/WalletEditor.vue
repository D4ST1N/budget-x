<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallets";
import { AccessLevel } from "@/types/AccessLevel";
import { Wallet } from "@/types/Wallet";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ConfirmDialog from "../Dialog/ConfirmDialog.vue";

const walletStore = useWalletStore();
const { currentWallet, currentAccessLevel } = storeToRefs(walletStore);
const newWallet = ref({ ...currentWallet.value });

const requiredField = required();
const valid = ref<boolean>(false);

const editAvailable = computed(() =>
  hasAccess([AccessLevel.Edit], currentAccessLevel.value)
);

const deleteAvailable = computed(() =>
  hasAccess([AccessLevel.Delete], currentAccessLevel.value)
);

const isChanged = computed(
  () => JSON.stringify(currentWallet.value) !== JSON.stringify(newWallet.value)
);

function updateWallet() {
  walletStore.updateWalletName(newWallet.value as Wallet);
}

function deleteWallet() {
  walletStore.deleteWallet();
}
</script>

<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="updateWallet">
      <v-text-field
        v-model="newWallet.name"
        :label="$t('wallet.walletName')"
        hide-details="auto"
        :readonly="!editAvailable"
        :rules="[requiredField]"
      ></v-text-field>
      <br />

      <v-divider></v-divider>

      <div :class="$style.actions">
        <v-btn
          v-if="editAvailable"
          :disabled="!valid || !isChanged"
          type="submit"
          variant="elevated"
          color="primary"
        >
          {{ $t("ui.save") }}
        </v-btn>
        <ConfirmDialog
          v-if="deleteAvailable"
          :title="$t('wallet.removeWalletTitle')"
          :message="$t('wallet.removeWalletMessage')"
          :confirm="deleteWallet"
        >
          <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" variant="text" color="error">
              {{ $t("ui.delete") }}
            </v-btn>
          </template>
        </ConfirmDialog>
      </div>
    </v-form>
  </v-card-text>
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
}
</style>
