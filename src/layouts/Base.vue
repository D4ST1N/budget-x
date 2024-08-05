<script setup lang="ts">
import Layout from "@/layouts/Layout.vue";
import BottomNavigation from "@/layouts/BottomNavigation.vue";

const emit = defineEmits(["mounted"]);

function onMounted() {
  emit("mounted");
}
</script>

<template>
  <Layout @mounted="onMounted">
    <template #default>
      <slot />
    </template>

    <template #navigation>
      <slot name="navigation">
        <BottomNavigation />
      </slot>
    </template>
  </Layout>
</template>
