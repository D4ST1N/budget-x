<script setup lang="ts">
import { AccessLevel } from "@/types/AccessLevel";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const model = defineModel<AccessLevel[]>();
const props = defineProps<{
  accessLevels: AccessLevel[];
}>();

const accessLevelsOptions = Object.values(AccessLevel).map((accessLevel) => ({
  label: t(`accessLevel.${accessLevel}`),
  value: accessLevel,
}));
</script>

<template>
  <div>
    <v-checkbox
      v-for="accessLevel in accessLevelsOptions"
      :key="accessLevel.value"
      v-model="model"
      :label="accessLevel.label"
      :value="accessLevel.value"
      :disabled="!props.accessLevels.includes(accessLevel.value)"
      hide-details
      density="compact"
      :class="$style.checkbox"
    />
  </div>
</template>

<style lang="scss" module>
.checkbox {
  :global(.v-label) {
    margin-left: 6px;
  }
}
</style>
