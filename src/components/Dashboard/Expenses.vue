<script setup lang="ts">
import DashboardPanel from "./DashboardPanel.vue";

const options = {
  chart: {
    type: "pie",
    backgroundColor: "transparent", // Прозорий фон
    width: 360, // Збільшена ширина
    height: 360, // Збільшена висота
  },
  title: {
    text: "Витрати цього місяця",
    style: {
      color: "#FFFFFF", // Білий текст заголовка
    },
  },
  plotOptions: {
    pie: {
      innerSize: "50%",
      borderColor: "transparent",
      dataLabels: {
        enabled: true,
        style: {
          color: "#FFFFFF", // Білий текст на діаграмі
        },
      },
    },
  },
  series: [
    {
      name: "Витрати",
      data: [
        { name: "Оренда", y: 500, color: "#3498db" }, // Блакитний
        { name: "Продукти", y: 300, color: "#e74c3c" }, // Червоний
        { name: "Кафе та ресторани", y: 100, color: "#2ecc71" }, // Зелений
        { name: "Автомобіль", y: 150, color: "#9b59b6" }, // Фіолетовий
        { name: "Дитина", y: 200, color: "#f1c40f" }, // Жовтий
        { name: "Одяг", y: 120, color: "#e67e22" }, // Оранжевий
        { name: "Розваги", y: 80, color: "#1abc9c" }, // Бірюзовий
        { name: "Інше", y: 50, color: "#95a5a6" }, // Сірий
      ],
    },
  ],
  tooltip: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Темний фон підказки
    style: {
      color: "#FFFFFF", // Білий текст підказки
    },
  },
};
</script>

<template>
  <DashboardPanel :class="$style.container">
    <highcharts :options="options"></highcharts>
    <v-btn variant="text" :to="{ name: 'Statistic' }">
      <template #prepend>
        <v-icon>mdi-chart-bar-stacked</v-icon>
      </template>
      {{ $t("wallet.detail") }}
    </v-btn>
  </DashboardPanel>
</template>

<style lang="scss" module>
.container {
  padding: 24px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
