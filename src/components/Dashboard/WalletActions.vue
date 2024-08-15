<script setup lang="ts">
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallets";
import { AccessLevel } from "@/types/AccessLevel";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const walletStore = useWalletStore();
const { currentAccessLevel } = storeToRefs(walletStore);

const shareAvailable = computed(() =>
  hasAccess([AccessLevel.ShareWallet], currentAccessLevel.value)
);

const editAvailable = computed(() =>
  hasAccess(
    [AccessLevel.Edit, AccessLevel.Delete],
    currentAccessLevel.value,
    "OR"
  )
);
</script>

<template>
  <div v-if="shareAvailable || editAvailable" :class="$style.container">
    <v-btn v-if="shareAvailable" :to="{ name: 'ShareWallet' }" variant="text">
      <template #prepend>
        <v-icon>mdi-share-variant</v-icon>
      </template>
      {{ $t("wallet.share") }}
    </v-btn>
    <v-btn v-if="editAvailable" :to="{ name: 'EditWallet' }" variant="text">
      <template #prepend>
        <v-icon>mdi-cog</v-icon>
      </template>
      {{ $t("wallet.edit") }}
    </v-btn>
  </div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}
</style>
