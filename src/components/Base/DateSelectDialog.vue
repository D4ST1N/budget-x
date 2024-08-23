<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";

interface DateSelectDialogProps {
  isOpen: boolean;
  date: Date;
}

const props = defineProps<DateSelectDialogProps>();
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
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('ui.selectDate')"
    title-icon="mdi-calendar-range"
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
      <CloseButton @click="showDialog = false" />
    </template>
  </BaseDialog>
</template>

<style lang="scss" module>
.datePicker {
  :global(.v-picker-title) {
    display: none;
  }
}
</style>
