<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <v-btn variant="text" color="white">
    {{ t("ui.close") }}
  </v-btn>
</template>
