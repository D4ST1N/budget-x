<script setup lang="ts">
import Layout from "@/layouts/Layout.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();

function goToHome() {
  router.push({ name: "Home" });
}
</script>

<template>
  <Layout :app-bar="false">
    <template #default>
      <div :class="$style.wrapper">
        <v-card>
          <v-card-title>
            <v-icon>mdi-lock</v-icon>
            {{ t("ui.accessDenied") }}
          </v-card-title>

          <v-card-text>
            <p>{{ t("ui.noPermission") }}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="text" @click="goToHome">
              <template #prepend>
                <v-icon>mdi-home</v-icon>
              </template>
              {{ t("ui.goHome") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </template>
  </Layout>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
