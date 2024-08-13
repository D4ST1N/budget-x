<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallets";
import { ref } from "vue";

const walletStore = useWalletStore();

const walletName = ref<string>("");
const requiredField = required();
const valid = ref<boolean>(false);

function createWallet() {
  walletStore.createWallet(walletName.value);
}
</script>

<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="createWallet">
      <v-text-field
        v-model="walletName"
        :label="$t('wallet.walletName')"
        hide-details="auto"
        :rules="[requiredField]"
      ></v-text-field>
      <br />

      <v-btn
        :disabled="!valid"
        type="submit"
        variant="elevated"
        color="primary"
      >
        {{ $t("ui.save") }}
      </v-btn>
    </v-form>
  </v-card-text>
</template>
