<script setup lang="ts">
import LanguageSelect from "@/components/LanguageSelect/LanguageSelect.vue";
import UserInfo from "@/components/UserInfo/UserInfo.vue";
import BottomNavigation from "@/layouts/BottomNavigation.vue";
import Layout from "@/layouts/Layout.vue";
</script>

<template>
  <Layout>
    <template #app-bar-prepend>
      <UserInfo />
    </template>

    <template #app-bar-append>
      <LanguageSelect />
    </template>

    <template #default>
      <slot />
    </template>

    <template #navigation>
      <BottomNavigation />
    </template>
  </Layout>
</template>
