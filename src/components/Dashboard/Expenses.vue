<script setup lang="ts">
import {
  enrichExpenses,
  formatDate,
  generateColorFromHash,
  groupExpensesByDate,
} from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { Category } from "@/types/Category";
import { Expense } from "@/types/Expense";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "vuetify";
import DashboardPanel from "./DashboardPanel.vue";

const { t, n } = useI18n();
const date = useDate();
const walletStore = useWalletStore();

const { currentWallet } = storeToRefs(walletStore);
const chartContainer = ref<InstanceType<typeof DashboardPanel> | null>(null);
const containerWidth = ref<number>(360);
const selectedDate = ref(new Date());
const isCalendarOpen = ref<boolean>(false);
const chartType = ref<"pie" | "line">("pie");
const period = ref<"month" | "year">("month");
const periodExpenses = ref<Expense[]>([]);
const periodCategories = ref<Category[]>([]);
const chartKey = ref(0);

const totalAmount = computed(() =>
  periodExpenses.value.reduce((total, expense) => total + expense.amount, 0)
);

const pieChartData = computed(() => {
  const categoryTotals: Record<string, number> = {};

  const enrichedExpenses = enrichExpenses({
    expenses: periodExpenses.value,
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

const lineChartData = computed(() => {
  const groupedExpenses = groupExpensesByDate(
    enrichExpenses({
      expenses: periodExpenses.value,
      categories: periodCategories.value,
      tags: [],
    }),
    date,
    { order: "asc", sortBy: period.value === "month" ? "day" : "month" }
  );

  return Object.entries(groupedExpenses).map(([date, expenses]) => {
    return {
      name: date,
      y: expenses.reduce((total, expense) => total + expense.expense.amount, 0),
    };
  });
});

const pieChartOptions = computed(() => {
  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      width: containerWidth.value,
      height: containerWidth.value - 40,
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
      width: containerWidth.value,
      height: containerWidth.value - 40,
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
        color: "rgb(var(--v-theme-primary))", // Колір підпису серії
      },
    },
    series: [
      {
        name: graphTypeLineCaption.value,
        data: lineChartData.value,
        color: "rgb(var(--v-theme-primary))", // Колір лінії
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

const chartOptions = computed(() => {
  if (chartType.value === "pie") {
    return pieChartOptions.value;
  } else {
    return lineChartOptions.value;
  }
});

const graphTypeLineLabel = computed(() => {
  return period.value === "month"
    ? t("statistic.byDay")
    : t("statistic.byMonth");
});

const graphTypeLineCaption = computed(() => {
  return period.value === "month"
    ? t("statistic.dailyExpenses")
    : t("statistic.monthlyExpenses");
});

onMounted(() => {
  if (chartContainer.value) {
    containerWidth.value = Math.min(
      chartContainer.value.$el.clientWidth,
      chartContainer.value.$el.clientHeight
    );
    getData();
  }
});

watch(chartOptions, () => {
  chartKey.value += 1;
});

watch(period, getData);

watch(currentWallet, getData);

function selectMonth(month: number) {
  isCalendarOpen.value = false;
  selectedDate.value = date.setMonth(selectedDate.value, month) as Date;
  getData();
}

async function getData() {
  let startDate: string;
  let endDate: string;

  if (period.value === "month") {
    startDate = formatDate(
      date.startOfMonth(selectedDate.value) as string,
      "YYYY-MM-DD"
    );
    endDate = formatDate(
      date.endOfMonth(selectedDate.value) as string,
      "YYYY-MM-DD"
    );
  } else {
    startDate = formatDate(
      date.startOfYear(selectedDate.value) as string,
      "YYYY-MM-DD"
    );
    endDate = formatDate(
      date.endOfYear(selectedDate.value) as string,
      "YYYY-MM-DD"
    );
  }

  const expensesData = await walletStore.fetchExpenses({ startDate, endDate });

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
        <div :class="$style.switcherWrapper">
          <div class="text-primary" :class="$style.switcherLabel">
            {{ t("statistic.graphType") }}
          </div>

          <v-btn-toggle
            v-model="chartType"
            mandatory
            size="x-small"
            density="compact"
          >
            <v-btn size="x-small" value="pie">
              {{ t("statistic.byCategory") }}
            </v-btn>
            <v-btn size="x-small" value="line">
              {{ graphTypeLineLabel }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <div :class="$style.switcherWrapper">
          <div class="text-primary" :class="$style.switcherLabel">
            {{ t("statistic.period") }}
          </div>

          <v-btn-toggle
            v-model="period"
            mandatory
            size="x-small"
            density="compact"
          >
            <v-btn size="x-small" value="month">{{ t("unit.month") }}</v-btn>
            <v-btn size="x-small" value="year">{{ t("unit.year") }}</v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <div :class="$style.title">
        <span>{{ t("statistic.monthExpenses") }}</span>

        <v-btn variant="text" @click="isCalendarOpen = true">
          {{ date.format(selectedDate, "monthAndYear") }}

          <template #append>
            <v-icon>mdi-menu-down</v-icon>
          </template>
        </v-btn>
      </div>
    </div>

    <v-dialog v-model="isCalendarOpen">
      <v-date-picker
        v-model="selectedDate"
        type="months"
        view-mode="months"
        @update:month="selectMonth"
      />
    </v-dialog>

    <highcharts
      v-if="periodExpenses.length"
      :key="chartKey"
      :options="chartOptions"
      :class="$style.chart"
    ></highcharts>
    <div v-else :class="$style.noData">
      {{ t("expense.noExpensesThisMonth") }}
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
  padding: 6px 12px;
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
  margin-top: 12px;
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
  gap: 8px;
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
