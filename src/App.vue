<script setup lang="ts">
import Notifications from "@/components/Notifications/Notifications.vue";
import { useLanguageStore } from "@/store/language";

useLanguageStore();
</script>

<template>
  <v-responsive>
    <RouterView />
    <Notifications />
  </v-responsive>
</template>
