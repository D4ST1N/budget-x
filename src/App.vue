<script setup lang="ts">
import Notifications from "@/components/Notifications/Notifications.vue";
</script>

<template>
  <v-responsive>
    <RouterView />
    <Notifications />
  </v-responsive>
</template>
