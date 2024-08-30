<script setup lang="ts">
import { MonthOrYear, Period } from "@/types/Period";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import RadioGroup from "../Base/RadioGroup.vue";

type PeriodSelectProps = {
  selectedPeriod: MonthOrYear;
};

const { t } = useI18n();
const emit = defineEmits(["update:selectedPeriod"]);
const props = defineProps<PeriodSelectProps>();

const periods = [
  { name: t("unit.month"), value: Period.Month },
  { name: t("unit.year"), value: Period.Year },
];

const period = computed({
  get: () => props.selectedPeriod,
  set: (value) => emit("update:selectedPeriod", value),
});
</script>

<template>
  <RadioGroup
    v-model:selected-value="period"
    :label="t('statistic.period')"
    :items="periods"
  />
</template>
