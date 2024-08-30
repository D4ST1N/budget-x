<script setup lang="ts">
import { ChartType, PieOrLine } from "@/types/ChartType";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import RadioGroup from "../Base/RadioGroup.vue";

type ChartTypeSelectProps = {
  selectedType: PieOrLine;
  lineChartText: string;
};

const { t } = useI18n();
const emit = defineEmits(["update:selectedType"]);
const props = defineProps<ChartTypeSelectProps>();

const types = computed(() => [
  { name: t("statistic.byCategory"), value: ChartType.Pie },
  { name: props.lineChartText, value: ChartType.Line },
]);

const type = computed({
  get: () => props.selectedType,
  set: (value) => emit("update:selectedType", value),
});
</script>

<template>
  <RadioGroup
    v-model:selected-value="type"
    :label="t('statistic.graphType')"
    :items="types"
  />
</template>
