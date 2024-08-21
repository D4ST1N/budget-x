<script setup lang="ts">
import { Ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  title: string;
  message: string;
  confirm: () => void;
}>();

const { t } = useI18n();

function onConfirmClick(isActive: Ref<boolean>) {
  props.confirm();
  isActive.value = false;
}
</script>

<template>
  <v-dialog max-width="400">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-title :class="$style.multiLineTitle">{{ title }}</v-card-title>

        <v-card-text>{{ message }}</v-card-text>

        <v-card-actions>
          <v-btn @click="isActive.value = false" color="error">
            {{ t("ui.cancel") }}
          </v-btn>

          <v-btn
            @click="onConfirmClick(isActive)"
            color="primary"
            variant="elevated"
          >
            {{ t("ui.confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" module>
.multiLineTitle {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>
