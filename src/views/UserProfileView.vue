<script setup lang="ts">
import { logoutUrl } from "@/helpers/serverUrls";
import UserProfileLayout from "@/layouts/UserProfile.vue";
import { auth } from "@/plugins/axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

async function logoutClick() {
  await auth.get(logoutUrl());
}
</script>

<template>
  <UserProfileLayout>
    <v-card-title>{{ t("profile.title") }}</v-card-title>

    <v-list density="default" bg-color="background">
      <v-list-item color="primary" rounded="xl" @click="logoutClick">
        <template v-slot:prepend>
          <v-icon>mdi-logout</v-icon>
        </template>

        <v-list-item-title>
          {{ t("profile.logout") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </UserProfileLayout>
</template>

<style lang="scss" module>
.pageMenu {
  margin: 16px;
}
</style>
