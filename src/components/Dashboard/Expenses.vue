<script setup lang="ts">
import { generateColorFromHash } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { ExpensesData } from "@/types/Expense";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import DashboardPanel from "./DashboardPanel.vue";

interface ChartData {
  name: string;
  y: number;
  color: string;
}

const { t, n } = useI18n();

const walletStore = useWalletStore();
const chartData = ref<ChartData[]>([]);
const chartContainer = ref<InstanceType<typeof DashboardPanel> | null>(null);
const containerWidth = ref<number>(360);

const totalAmount = computed(() =>
  chartData.value.reduce((acc, data) => acc + data.y, 0)
);

const chartOptions = computed(() => {
  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      width: containerWidth.value,
      height: containerWidth.value - 40,
    },
    title: {
      text: t("wallet.monthExpenses"),
      style: {
        color: "#FFFFFF",
      },
    },
    subtitle: {
      useHTML: true,
      text: `<div style="display: flex; align-items: center; flex-direction: column; color: #FFFFFF"><span style="font-size: 12px">${t("wallet.total")}</span><div style="font-size: 14px"><b>${n(totalAmount.value, "currency")}</b></div></div>`,
      floating: true,
      verticalAlign: "middle",
      y: 25,
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
        data: chartData.value,
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

onMounted(() => {
  if (chartContainer.value) {
    containerWidth.value = chartContainer.value.$el.clientWidth;
    getData();
  }
});

async function getData() {
  const { expenses, categories }: ExpensesData =
    await walletStore.fetchWalletExpenses();

  const categoryTotals: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (categoryTotals[expense.categoryId]) {
      categoryTotals[expense.categoryId] += expense.amount;
    } else {
      categoryTotals[expense.categoryId] = expense.amount;
    }
  });

  chartData.value = Object.entries(categoryTotals).map(
    ([categoryId, totalAmount]) => {
      const category = categories.find((c) => c._id === categoryId)!;

      return {
        name: category.name,
        y: totalAmount,
        color: generateColorFromHash(category._id),
      };
    }
  );
}
</script>

<template>
  <DashboardPanel ref="chartContainer" :class="$style.container">
    <slot />
    <highcharts :options="chartOptions" :class="$style.chart"></highcharts>
    <v-btn variant="text" :to="{ name: 'Statistic' }">
      <template #prepend>
        <v-icon>mdi-chart-bar-stacked</v-icon>
      </template>
      {{ t("wallet.detail") }}
    </v-btn>
  </DashboardPanel>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.chart {
  margin-top: 12px;
}
</style>
