<script setup lang="ts">
import WalletList from "@/components/WalletList/WalletList.vue";
import { onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    appBar?: boolean;
  }>(),
  {
    appBar: true,
  }
);
const emit = defineEmits(["mounted"]);

onMounted(() => {
  emit("mounted");
});
</script>

<template>
  <v-app>
    <v-app-bar v-if="props.appBar">
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
  --page-margin: 16px;
  --content-height: calc(
    100vh - var(--v-layout-top) - var(--v-layout-bottom) - var(--page-margin) *
      2
  );

  margin: var(--page-margin);
  flex-grow: 1;
  max-height: var(--content-height);
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
  height: 32px;
}
</style>
