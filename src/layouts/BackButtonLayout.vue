<script setup lang="ts">
import Layout from "@/layouts/Layout.vue";
import { useRouter } from "vue-router";

export interface Props {
  showBackButton?: boolean;
  backRouteName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: true,
});
const router = useRouter();

function goBack() {
  if (props.backRouteName) {
    router.push({ name: props.backRouteName });

    return;
  }

  const { matched } = router.currentRoute.value;
  const currentRouteIndex = matched.findIndex(
    (routeLocation) => routeLocation.name === router.currentRoute.value.name
  );

  if (currentRouteIndex > 0) {
    router.push({ name: matched[currentRouteIndex - 1].name });
  } else {
    router.push({ name: "Home" });
  }
}
</script>

<template>
  <Layout>
    <template #app-bar-prepend>
      <v-btn
        v-if="props.showBackButton"
        density="comfortable"
        icon="mdi-arrow-left"
        @click="goBack"
      ></v-btn>
      <span v-else></span>
    </template>

    <template #app-bar>
      <slot name="app-bar" />
    </template>

    <template #app-bar-append>
      <slot name="app-bar-append">
        <span></span>
      </slot>
    </template>

    <template #default>
      <slot />
    </template>

    <template #navigation> </template>
  </Layout>
</template>

<style lang="scss" module>
.pageTitle {
  flex-grow: 1;
}
</style>
