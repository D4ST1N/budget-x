<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();

onMounted(() => {
  userStore.loginUser("#stytch-sdk");
});
</script>

<template>
  <v-card variant="tonal" :class="$style.page">
    <v-card-title>{{ t("login.title") }}</v-card-title>
    <div id="stytch-sdk"></div>
  </v-card>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 16px;
}
</style>
