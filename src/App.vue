<script setup lang="ts">
import UserInfo from "@/components/UserInfo/UserInfo.vue";
</script>

<template>
  <v-responsive>
    <v-app>
      <v-app-bar>
        <template #prepend>
          <UserInfo />
        </template>
      </v-app-bar>
      <v-main class="d-flex align-center justify-center">
        <RouterView />
      </v-main>

      <v-bottom-navigation grow color="secondary">
        <v-btn :to="{ name: 'Home' }">
          <v-icon>mdi-home</v-icon>
          <span>Home</span>
        </v-btn>

        <v-btn :to="{ name: 'Statistic' }">
          <v-icon>mdi-chart-bar-stacked</v-icon>
          <span>Statistic</span>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </v-responsive>
</template>
