<script setup lang="ts">
import { useWalletStore } from "@/store/wallets";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const walletsStore = useWalletStore();
const { wallets, sharedWallets, currentWallet, selectedWallet } =
  storeToRefs(walletsStore);

const myWallets = computed(() => {
  return wallets.value.map((wallet) => {
    return {
      value: wallet._id,
      title: wallet.name,
    };
  });
});

const otherWallets = computed(() => {
  return sharedWallets.value.map((wallet) => {
    return {
      value: wallet._id,
      title: wallet.name,
    };
  });
});

const allWallets = computed(() => {
  return [...myWallets.value, ...otherWallets.value];
});

function selectWallet(walletId: string) {
  selectedWallet.value = walletId;
}
</script>

<template>
  <v-menu v-if="allWallets.length > 0">
    <template #activator="{ props }">
      <v-btn color="primary" variant="text" v-bind="props">
        <span :class="$style.truncate">{{ currentWallet?.name }}</span>
        <template #append>
          <v-icon>mdi-menu-down</v-icon>
        </template>
      </v-btn>
    </template>
    <v-list>
      <template v-if="myWallets.length">
        <v-list-subheader color="primary">{{
          $t("wallet.myWallets")
        }}</v-list-subheader>

        <v-list-item
          v-for="wallet in myWallets"
          :key="wallet.value"
          @click="selectWallet(wallet.value)"
        >
          <v-list-item-title>{{ wallet.title }}</v-list-item-title>
        </v-list-item>
      </template>

      <v-divider
        v-if="myWallets.length && otherWallets.length"
        class="mb-2"
      ></v-divider>

      <template v-if="otherWallets.length">
        <v-list-subheader color="primary">{{
          $t("wallet.sharedWallets")
        }}</v-list-subheader>

        <v-list-item
          v-for="wallet in otherWallets"
          :key="wallet.value"
          @click="selectWallet(wallet.value)"
        >
          <v-list-item-title>{{ wallet.title }}</v-list-item-title>
        </v-list-item>
      </template>
      <v-divider class="mb-2"></v-divider>

      <div class="px-1">
        <v-btn :to="{ name: 'AddWallet' }" variant="text">
          <template #prepend>
            <v-icon>mdi-plus</v-icon>
          </template>

          {{ $t("wallet.add") }}
        </v-btn>
      </div>
    </v-list>
  </v-menu>
  <v-btn v-else :to="{ name: 'AddWallet' }" base-color="primary">
    <template #prepend>
      <v-icon>mdi-plus</v-icon>
    </template>
    {{ $t("wallet.add") }}
  </v-btn>
</template>

<style lang="scss" module>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
