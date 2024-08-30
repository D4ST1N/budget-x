<script setup lang="ts">
import {
  enrichExpenses,
  formatDate,
  groupExpensesByDate,
} from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { ExpenseEnriched } from "@/types/Expense";
import { Period } from "@/types/Period";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "vuetify";
import { VList } from "vuetify/components";
import DateSelection from "../Base/DateSelection.vue";
import DashboardPanel from "../Dashboard/DashboardPanel.vue";
import ExpenseItem from "./Expense.vue";

const { t } = useI18n();
const date = useDate();
const walletStore = useWalletStore();

const { currentWallet } = storeToRefs(walletStore);
const selectedDate = ref(new Date());
const expenses = ref<ExpenseEnriched[]>([]);
const expanded = ref<boolean>(false);
const isCalendarOpen = ref(false);
const list = ref<InstanceType<typeof VList> | null>(null);

const groupedExpenses = computed(() => {
  return groupExpensesByDate(expenses.value, date);
});

watch(currentWallet, fetchExpenses);
watch(selectedDate, fetchExpenses);

fetchExpenses();

async function fetchExpenses() {
  expenses.value = [];

  const startDate = formatDate(
    date.startOfMonth(selectedDate.value) as string,
    "YYYY-MM-DD"
  );
  const endDate = formatDate(
    date.endOfMonth(selectedDate.value) as string,
    "YYYY-MM-DD"
  );

  const expensesData = await walletStore.fetchExpenses({ startDate, endDate });

  if (!expensesData) {
    return;
  }

  expenses.value = enrichExpenses(expensesData);
}

function collapse() {
  selectedDate.value = new Date();
  expanded.value = false;
  list.value?.$el.scrollTo(0, 0);
}

function showAllExpenses() {
  expanded.value = true;
}
</script>

<template>
  <DashboardPanel :class="$style.container">
    <slot />

    <div :class="$style.header">
      {{ t("expense.latestTransactions") }}
    </div>

    <v-list
      ref="list"
      :class="{ [$style.list]: true, [$style.expanded]: expanded }"
    >
      <DateSelection
        v-show="expanded"
        v-model:selected-date="selectedDate"
        :type="Period.Month"
        :class="$style.dateSelect"
      />

      <v-dialog v-model="isCalendarOpen">
        <v-date-picker
          v-model="selectedDate"
          type="month"
          @change="fetchExpenses"
        />
      </v-dialog>

      <v-list-subheader v-if="expenses.length === 0">
        {{ t("expense.noExpensesThisMonth") }}
      </v-list-subheader>

      <template v-for="(dailyExpenses, date) in groupedExpenses" :key="date">
        <v-list-subheader sticky :class="$style.dateHeader">
          {{ date }}
        </v-list-subheader>

        <ExpenseItem
          v-for="expense in dailyExpenses"
          :key="expense.expense._id"
          :expense="expense"
          :delete-available="expanded"
          :edit-available="expanded"
          @update:expense="fetchExpenses"
          @delete:expense="fetchExpenses"
        >
        </ExpenseItem>
      </template>

      <div
        :class="{ [$style.topPanel]: true, [$style.visibleTopPanel]: expanded }"
      >
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          @click="collapse"
        ></v-btn>
      </div>
    </v-list>

    <div v-show="!expanded && expenses.length" :class="$style.bottomPanel">
      <v-btn variant="text" color="primary" @click="showAllExpenses">
        {{ t("expense.seeAll") }}
      </v-btn>
    </div>
  </DashboardPanel>
</template>

<style lang="scss" module>
.container {
  --latest-expenses-title-height: 40px;
  --dashboard-button-padding: min(
    var(--dashboard-button-height),
    var(--dashboard-padding)
  );
  --container-height: calc(
    var(--content-height) - var(--dashboard-padding) - var(
        --dashboard-header-height
      ) - var(--dashboard-button-padding) - var(--dashboard-button-height) - var(
        --dashboard-badge-height
      )
  );

  position: relative;
}

.header {
  height: var(--latest-expenses-title-height);
  font-size: 18px;
  padding: 6px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dateSelect {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgb(62 56 53);
}

.list {
  --collapsed-height: calc(
    var(--container-height) - var(--latest-expenses-title-height) - var(
        --dashboard-padding
      ) * 2
  );

  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px 6px;
  background-color: rgb(36 28 25);

  max-height: var(--collapsed-height);
  height: var(--collapsed-height);
  overflow: hidden;
  position: relative;
  transition: all 0.375s ease;
  top: 0;
  left: 0;
  width: 100%;

  &.expanded {
    max-height: var(--content-height);
    height: var(--content-height);
    width: calc(100% + var(--dashboard-padding) * 2);
    left: -6px;
    top: calc(
      (
          var(--latest-expenses-title-height) + var(--dashboard-header-height) +
            var(--dashboard-padding) * 2
        ) * -1
    );
    overflow: auto;
    background: rgb(62 56 53);
    z-index: 1;

    .bottomPanel {
      opacity: 0;
    }

    .dateHeader {
      top: 48px;
    }
  }
}

.dateHeader {
  background: rgb(62 56 53);
}

.topPanel {
  position: fixed;
  top: calc(var(--v-layout-top) + var(--page-margin));
  right: var(--page-margin);
  z-index: 2;
  opacity: 0;
  pointer-events: none;

  &.visibleTopPanel {
    opacity: 1;
    pointer-events: all;
    transition: opacity 0.25s ease 0.375s;
  }
}

.bottomPanel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  background: linear-gradient(
    to bottom,
    rgba(63, 56, 53, 0) 0%,
    rgb(63, 56, 53) 50%
  );
  z-index: 1;
}
</style>
