<script setup lang="ts">
import UserProfileLayout from "@/layouts/UserProfile.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

function logoutClick() {
  sessionStorage.removeItem("session_token");
  router.push({ name: "Login" });
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
