<script setup lang="ts">
import Layout from "@/layouts/Layout.vue";
import BottomNavigation from "@/layouts/BottomNavigation.vue";
import UserInfo from "@/components/UserInfo/UserInfo.vue";
import LanguageSelect from "@/components/LanguageSelect/LanguageSelect.vue";
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
