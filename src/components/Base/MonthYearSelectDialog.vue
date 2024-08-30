<script setup lang="ts">
import { MonthOrYear, Period } from "@/types/Period";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "vuetify";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "./CloseButton.vue";
import MonthSelection from "./MonthSelection.vue";
import YearSelection from "./YearSelection.vue";

interface DateSelectDialogProps {
  isOpen: boolean;
  date: Date;
  view?: MonthOrYear;
  disableViewSwitch?: boolean;
}

const dateAdapter = useDate();
const emit = defineEmits(["update:isOpen", "update:date"]);
const props = withDefaults(defineProps<DateSelectDialogProps>(), {
  view: Period.Month,
  disableViewSwitch: false,
});
const { t } = useI18n();

const dialogView = ref<MonthOrYear>(props.view);

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

const buttonText = computed(() => {
  return dialogView.value === Period.Month
    ? dateAdapter.format(props.date, "year")
    : dateAdapter.format(props.date, "month");
});

function toggleDialogView() {
  dialogView.value =
    dialogView.value === Period.Month ? Period.Year : Period.Month;
}

function selectDate(date: Date) {
  emit("update:date", date);
  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('ui.selectDate')"
    title-icon="mdi-calendar-range"
  >
    <template #default>
      <div v-if="!props.disableViewSwitch" :class="$style.toggleButton">
        <v-btn variant="elevated" block @click="toggleDialogView">
          {{ buttonText }}
        </v-btn>
      </div>

      <MonthSelection
        v-if="dialogView === Period.Month"
        :date="props.date"
        @update:date="selectDate"
      />
      <YearSelection v-else :date="props.date" @update:date="selectDate" />
    </template>

    <template #actions>
      <CloseButton @click="showDialog = false" />
    </template>
  </BaseDialog>
</template>

<style lang="scss" module>
.toggleButton {
  margin-bottom: 12px;
  padding: 0 8px;
}
</style>
