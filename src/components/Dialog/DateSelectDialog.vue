<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isOpen: Boolean,
  date: Date,
});

const emit = defineEmits(["update:isOpen", "update:date"]);

const { t } = useI18n();

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

const pickerValue = computed({
  get: () => props.date,
  set: (value) => emit("update:date", value),
});
</script>

<template>
  <v-dialog v-model="showDialog" width="400">
    <v-card
      max-width="400"
      prepend-icon="mdi-calendar-range"
      :title="t('ui.selectDate')"
    >
      <template #default>
        <v-date-picker
          v-model="pickerValue"
          scrollable
          show-current
          width="360"
          locale="ua"
          :class="$style.datePicker"
          @update:modelValue="showDialog = false"
        >
        </v-date-picker>
      </template>

      <template #actions>
        <v-btn variant="text" @click="showDialog = false">
          {{ t("ui.close") }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
.datePicker {
  :global(.v-picker-title) {
    display: none;
  }
}
</style>
