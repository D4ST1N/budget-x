<script setup lang="ts">
import { computed, ref } from "vue";
import { useDate } from "vuetify";
import DateList from "./DateList.vue";

type MonthSelectionProps = {
  date: Date;
};

const dateAdapter = useDate();
const emit = defineEmits(["update:date"]);
const props = defineProps<MonthSelectionProps>();

const monthValue = ref<number>(dateAdapter.getMonth(props.date));

const months = computed(() => {
  return Array.from({ length: 12 }, (_, i) => {
    return {
      name: dateAdapter.format(dateAdapter.setMonth(props.date, i), "month"),
      value: i,
    };
  });
});

function selectMonth(month: number) {
  monthValue.value = month;
  const newDate = dateAdapter.setMonth(props.date, month);

  emit("update:date", newDate);
}
</script>

<template>
  <DateList :items="months" :active="monthValue" @select:item="selectMonth" />
</template>
