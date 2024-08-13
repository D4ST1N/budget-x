<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallets";
import { Wallet } from "@/types/Wallet";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const walletStore = useWalletStore();
const { currentWallet } = storeToRefs(walletStore);
const newWallet = ref({ ...currentWallet.value });

const requiredField = required();
const valid = ref<boolean>(false);

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
        :rules="[requiredField]"
      ></v-text-field>
      <br />

      <v-divider></v-divider>

      <div :class="$style.actions">
        <v-btn
          :disabled="!valid || !isChanged"
          type="submit"
          variant="elevated"
          color="primary"
        >
          {{ $t("ui.save") }}
        </v-btn>
        <v-btn variant="text" color="error" @click="deleteWallet">
          {{ $t("ui.delete") }}
        </v-btn>
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
