<script setup lang="ts">
import { DayOrMonthOrYear, Period } from "@/types/Period";
import { computed, ref } from "vue";
import { useDate } from "vuetify";
import DateSelectDialog from "./DateSelectDialog.vue";
import MonthYearSelectDialog from "./MonthYearSelectDialog.vue";

type DaySelectionProps = {
  selectedDate: Date;
  type?: DayOrMonthOrYear;
};

const date = useDate();
const emit = defineEmits(["update:selected-date"]);
const props = withDefaults(defineProps<DaySelectionProps>(), {
  type: Period.Day,
});

const isDateSelectionDialogOpen = ref<boolean>(false);
const isMonthSelectionDialogOpen = ref<boolean>(false);

const selectedDate = computed({
  get: () => props.selectedDate,
  set: (value) => emit("update:selected-date", value),
});

const formattedDate = computed(() => {
  if (props.type === Period.Day) {
    return date.format(selectedDate.value, "normalDateWithWeekday");
  } else if (props.type === Period.Month) {
    return date.format(selectedDate.value, "monthAndYear");
  }

  return date.format(selectedDate.value, "year");
});

function showSelectionDialog() {
  if (props.type === Period.Day) {
    isDateSelectionDialogOpen.value = true;
  } else if (props.type === Period.Month) {
    isMonthSelectionDialogOpen.value = true;
  }
}

function previous() {
  if (props.type === Period.Day) {
    selectedDate.value = date.addDays(selectedDate.value, -1) as Date;
  } else if (props.type === Period.Month) {
    selectedDate.value = date.addMonths(selectedDate.value, -1) as Date;
  } else {
    selectedDate.value = date.addMonths(selectedDate.value, -12) as Date;
  }
}

function next() {
  if (props.type === Period.Day) {
    selectedDate.value = date.addDays(selectedDate.value, 1) as Date;
  } else if (props.type === Period.Month) {
    selectedDate.value = date.addMonths(selectedDate.value, 1) as Date;
  } else {
    selectedDate.value = date.addMonths(selectedDate.value, 12) as Date;
  }
}
</script>

<template>
  <div :class="$style.dateSelect">
    <v-btn icon="mdi-menu-left" variant="text" @click="previous"></v-btn>

    <v-btn color="primary" width="160" @click="showSelectionDialog">
      {{ formattedDate }}
    </v-btn>

    <v-btn icon="mdi-menu-right" variant="text" @click="next"></v-btn>

    <DateSelectDialog
      v-model:is-open="isDateSelectionDialogOpen"
      v-model:date="selectedDate"
    />
    <MonthYearSelectDialog
      v-model:is-open="isMonthSelectionDialogOpen"
      v-model:date="selectedDate"
    />
  </div>
</template>

<style lang="scss" module>
.dateSelect {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
