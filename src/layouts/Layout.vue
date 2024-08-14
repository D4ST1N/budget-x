<script setup lang="ts">
import WalletList from "@/components/WalletList/WalletList.vue";
import { onMounted } from "vue";

const emit = defineEmits(["mounted"]);

onMounted(() => {
  emit("mounted");
});
</script>

<template>
  <v-app>
    <v-app-bar>
      <template #prepend>
        <slot name="app-bar-prepend">
          <v-app-bar-title :class="$style.toolbarTitle">
            <img src="/img/budgetX-logo.png" alt="logo" :class="$style.logo" />
          </v-app-bar-title>
        </slot>
      </template>

      <template #default>
        <slot name="app-bar" />
      </template>

      <template #append>
        <slot name="app-bar-append">
          <WalletList />
        </slot>
      </template>
    </v-app-bar>

    <v-main :class="$style.contentWrapper">
      <v-card variant="tonal" :class="$style.page">
        <slot />
      </v-card>
    </v-main>

    <slot name="navigation" />
  </v-app>
</template>

<style lang="scss" module>
.contentWrapper {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.page {
  margin: 16px;
  flex-grow: 1;
}

.toolbarTitle {
  margin-left: 12px;

  :global(.v-toolbar-title__placeholder) {
    display: flex;
  }
}

.walletSelect {
  width: 160px;
}

.logo {
  height: 36px;
}
</style>
