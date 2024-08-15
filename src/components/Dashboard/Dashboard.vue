<script setup lang="ts">
import DashboardPanel from "./DashboardPanel.vue";
import Expenses from "./Expenses.vue";
import WalletActions from "./WalletActions.vue";
</script>

<template>
  <div :class="$style.container">
    <WalletActions :class="$style.header" />
    <Expenses :class="$style.main" />
    <DashboardPanel v-ripple :class="$style.expense">
      <div :class="$style.tileButton">
        <v-icon size="48">mdi-cash</v-icon>
        <span>{{ $t("wallet.addExpense") }}</span>
      </div>
    </DashboardPanel>
    <DashboardPanel v-ripple :class="$style.income">
      <div :class="$style.tileButton">
        <v-icon size="48">mdi-piggy-bank</v-icon>
        <span>{{ $t("wallet.addIncome") }}</span>
      </div>
    </DashboardPanel>
  </div>
</template>

<style lang="scss" module>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 140px;
  grid-template-areas:
    "main main"
    "expense income";
  height: 100%;
  padding: 6px;
  gap: 6px;

  &:has(.header:first-child) {
    grid-template-rows: 36px 1fr 140px;
    grid-template-areas:
      "header header"
      "main main"
      "expense income";
  }
}

.header {
  grid-area: header;
}

.main {
  grid-area: main;
}

.expense {
  grid-area: expense;
}

.income {
  grid-area: income;
}

.tileButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(var(--v-theme-primary));
  height: 100%;
}
</style>
