<script setup lang="ts">
import BackButtonLayout from "@/layouts/BackButtonLayout.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const i18n = useI18n();
const router = useRouter();
const title = computed(() =>
  i18n.t(router.currentRoute.value.meta.titleKey as string)
);
const showBackButton = router.currentRoute.value.meta.showBackButton as boolean;
</script>

<template>
  <BackButtonLayout :show-back-button="showBackButton" back-route-name="Home">
    <template #app-bar>
      <v-card-title :class="$style.pageTitle">
        {{ title }}
      </v-card-title>
    </template>

    <template #default>
      <router-view />
    </template>
  </BackButtonLayout>
</template>

<style lang="scss" module>
.pageTitle {
  flex-grow: 1;
}
</style>
