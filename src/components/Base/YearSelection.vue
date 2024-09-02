<script setup lang="ts">
import { computed, ref } from "vue";
import { useDate } from "vuetify";
import DateList from "./DateList.vue";

type YearSelectionProps = {
  date: Date;
};

const dateAdapter = useDate();
const emit = defineEmits(["update:date"]);
const props = defineProps<YearSelectionProps>();

const yearValue = ref<number>(dateAdapter.getYear(props.date));

const years = computed(() => {
  const currentYear = dateAdapter.getYear(props.date);
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = currentYear - 50 + i;

    return {
      name: year.toString(),
      value: year,
    };
  });

  return years;
});

function selectYear(year: number) {
  yearValue.value = year;
  const newDate = dateAdapter.setYear(props.date, year);

  emit("update:date", newDate);
}
</script>

<template>
  <DateList
    :items="years"
    :active="yearValue"
    @select:item="selectYear"
    :class="$style.list"
  />
</template>

<style lang="scss" module>
.list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
