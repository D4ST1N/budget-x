<script setup lang="ts">
import {
  enrichExpenses,
  generateColorFromHash,
  groupExpensesByDate,
  monthRange,
  yearRange,
} from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { Category } from "@/types/Category";
import { ChartType, PieOrLine } from "@/types/ChartType";
import { Expense } from "@/types/Expense";
import { MonthOrYear, Period } from "@/types/Period";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "vuetify";
import DateSelection from "../Base/DateSelection.vue";
import DashboardPanel from "../Dashboard/DashboardPanel.vue";
import ChartTypeSelect from "./ChartTypeSelect.vue";
import PeriodSelect from "./PeriodSelect.vue";

const { t, n } = useI18n();
const date = useDate();
const walletStore = useWalletStore();

const { currentWallet } = storeToRefs(walletStore);
const chartContainer = ref<InstanceType<typeof DashboardPanel> | null>(null);
const containerWidth = ref<number>(360);
const containerHeight = ref<number>(360);
const containerSize = ref<number>(360);
const selectedDate = ref(new Date());
const chartType = ref<PieOrLine>(ChartType.Pie);
const period = ref<MonthOrYear>(Period.Month);
const periodExpenses = ref<Expense[]>([]);
const periodCategories = ref<Category[]>([]);
const chartKey = ref(0);

const totalAmount = computed(() =>
  periodExpenses.value
    .filter((e) => !e.isIncome)
    .reduce((total, expense) => total + expense.amount, 0)
);

const pieChartData = computed(() => {
  const categoryTotals: Record<string, number> = {};

  const enrichedExpenses = enrichExpenses({
    expenses: periodExpenses.value.filter((e) => !e.isIncome),
    categories: periodCategories.value,
    tags: [],
  });

  enrichedExpenses.forEach((expensesData) => {
    if (categoryTotals[expensesData.parentCategory!._id]) {
      categoryTotals[expensesData.parentCategory!._id] +=
        expensesData.expense.amount;
    } else {
      categoryTotals[expensesData.parentCategory!._id] =
        expensesData.expense.amount;
    }
  });

  return Object.entries(categoryTotals).map(([categoryId, totalAmount]) => {
    const category = periodCategories.value.find((c) => c._id === categoryId)!;

    return {
      name: category.name,
      y: totalAmount,
      color: generateColorFromHash(category._id),
    };
  });
});

const lineChartExpensesData = computed(() => {
  const groupedExpenses = groupExpensesByDate(
    enrichExpenses({
      expenses: periodExpenses.value.filter((e) => !e.isIncome),
      categories: periodCategories.value,
      tags: [],
    }),
    date,
    { order: "asc", sortBy: period.value === Period.Month ? "day" : "month" }
  );

  return Object.entries(groupedExpenses).map(([date, expenses]) => {
    return {
      name: date,
      y: expenses.reduce((total, expense) => total + expense.expense.amount, 0),
    };
  });
});

const lineChartIncomesData = computed(() => {
  const groupedExpenses = groupExpensesByDate(
    enrichExpenses({
      expenses: periodExpenses.value.filter((e) => e.isIncome),
      categories: periodCategories.value,
      tags: [],
    }),
    date,
    { order: "asc", sortBy: period.value === Period.Month ? "day" : "month" }
  );

  return Object.entries(groupedExpenses).map(([date, expenses]) => {
    return {
      name: date,
      y: expenses.reduce((total, expense) => total + expense.expense.amount, 0),
    };
  });
});

const lineChartSeries = computed(() => {
  const series = [
    {
      name: graphTypeLineCaption.value,
      data: lineChartExpensesData.value,
      color: "rgb(var(--v-theme-primary))",
    },
    {
      name: graphTypeLineIncomeCaption.value,
      data: lineChartIncomesData.value,
      color: "rgb(var(--v-theme-secondary))",
    },
  ];
  return period.value === Period.Month ? [series[0]] : series;
});

const pieChartOptions = computed(() => {
  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      width: containerSize.value,
      height: containerSize.value,
      marginTop: -100,
    },
    title: {
      text: undefined,
    },
    plotOptions: {
      pie: {
        innerSize: "60%",
        borderColor: "transparent",
        dataLabels: {
          enabled: true,
          style: {
            color: "#FFFFFF",
          },
        },
      },
    },
    series: [
      {
        name: t("expense.expenses"),
        data: pieChartData.value,
      },
    ],
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      style: {
        color: "#FFFFFF",
      },
    },
  };
});

const lineChartOptions = computed(() => {
  return {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      width: containerSize.value,
      height: containerSize.value,
      marginTop: 30,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      type: "category",
      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
    },
    yAxis: {
      title: {
        text: t("expense.amount"),
        style: {
          color: "#FFFFFF",
        },
      },
      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
    },
    legend: {
      itemStyle: {
        color: "rgb(var(--v-theme-primary))",
      },
    },
    series: lineChartSeries.value,
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      style: {
        color: "#FFFFFF",
      },
    },
  };
});

const chartOptions = computed(() => {
  if (chartType.value === ChartType.Pie) {
    return pieChartOptions.value;
  } else {
    return lineChartOptions.value;
  }
});

const graphTypeLineLabel = computed(() => {
  return period.value === Period.Month
    ? t("statistic.byDay")
    : t("statistic.byMonth");
});

const graphTypeLineCaption = computed(() => {
  return period.value === Period.Month
    ? t("statistic.dailyExpenses")
    : t("statistic.monthlyExpenses");
});

const graphTypeLineIncomeCaption = computed(() => {
  return period.value === Period.Month
    ? t("statistic.dailyIncome")
    : t("statistic.monthlyIncome");
});

const noExpensesText = computed(() => {
  return period.value === Period.Month
    ? t("expense.noExpensesThisMonth")
    : t("expense.noExpensesThisYear");
});

const containerStyles = computed(() => {
  if (containerSize.value === containerHeight.value) {
    return {};
  }

  const diff = containerHeight.value - containerSize.value;

  return {
    marginTop: `${diff / 2}px`,
  };
});

onMounted(() => {
  updateContainerSize();

  getData();
});

watch(chartOptions, reRender);

watch(period, getData);

watch(currentWallet, getData);

function reRender() {
  chartKey.value += 1;
  updateContainerSize();
}

function updateContainerSize() {
  if (chartContainer.value) {
    containerWidth.value = chartContainer.value.$el.clientWidth;
    containerHeight.value = chartContainer.value.$el.clientHeight - 190;
    containerSize.value = Math.min(containerWidth.value, containerHeight.value);
  }
}

async function getData() {
  const expensesData = await walletStore.fetchExpenses(
    period.value === Period.Month
      ? monthRange(selectedDate.value, date)
      : yearRange(selectedDate.value, date)
  );

  if (!expensesData) {
    periodExpenses.value = [];
    periodCategories.value = [];

    return;
  }

  const { expenses, categories } = expensesData;

  periodExpenses.value = expenses;
  periodCategories.value = categories;
}
</script>

<template>
  <DashboardPanel ref="chartContainer" :class="$style.container">
    <slot />

    <div :class="$style.header">
      <div :class="$style.switchersContainer">
        <ChartTypeSelect
          v-model:selected-type="chartType"
          :line-chart-text="graphTypeLineLabel"
        />

        <PeriodSelect v-model:selected-period="period" />
      </div>

      <div :class="$style.title">
        <DateSelection
          v-model:selectedDate="selectedDate"
          :type="period"
          @update:selected-date="getData"
        />
      </div>
    </div>

    <highcharts
      v-if="periodExpenses.length"
      :key="chartKey"
      :options="chartOptions"
      :class="$style.chart"
      :style="containerStyles"
    ></highcharts>
    <div v-else :class="$style.noData">
      {{ noExpensesText }}
    </div>

    <div :class="$style.total">
      {{ t("statistic.total") }}:
      <b class="text-primary">{{ n(totalAmount, "currency") }}</b>
    </div>
  </DashboardPanel>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  max-width: calc(100vw - 32px);
  height: 100%;
}

.title {
  padding-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  z-index: 1;

  > span {
    position: relative;
    top: -1px;
  }
}

.chart {
  flex-grow: 1;
}

.noData {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 8px 0;
}

.total {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  padding: 8px 8px;
  margin: 0 10px;
  background: rgb(var(--v-theme-surface));
}

.switchersContainer {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  padding: 0 8px;
  width: 100%;
}

.switcherWrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.switcherLabel {
  display: flex;
  justify-content: flex-start;
  font-size: 12px;
}
</style>
