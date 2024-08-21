<script setup lang="ts">
import BaseLayout from "@/layouts/Base.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <BaseLayout>
    <v-card-title>{{ t("statistic.title") }}</v-card-title>
  </BaseLayout>
</template>
