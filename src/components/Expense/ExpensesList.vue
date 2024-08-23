<script setup lang="ts">
import { formatDate } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { Category } from "@/types/Category";
import { ExpenseEnriched } from "@/types/Expense";
import { Tag } from "@/types/Tag";
import { computed, ref } from "vue";
import { useDate } from "vuetify";
import ExpenseItem from "./Expense.vue";

const date = useDate();
const walletStore = useWalletStore();

const selectedDate = ref(new Date());
const expenses = ref<ExpenseEnriched[]>([]);
const isCalendarOpen = ref(false);

const fetchExpenses = async () => {
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
    expenses.value = [];

    return;
  }

  const categoryMap = new Map<string, Category>();
  const tagMap = new Map<string, Tag>();

  expensesData.categories.forEach((category) => {
    categoryMap.set(category._id, category);
  });

  expensesData.tags.forEach((tag) => {
    tagMap.set(tag._id, tag);
  });

  const enrichedExpenses = expensesData.expenses.map((expense) => {
    const category = categoryMap.get(expense.categoryId) || null;
    const tags = expense.tagIds
      .map((tagId) => tagMap.get(tagId))
      .filter(Boolean) as Tag[];

    return {
      expense,
      category,
      tags,
    } as ExpenseEnriched;
  });

  expenses.value = enrichedExpenses;
};

fetchExpenses();

const previousMonth = () => {
  selectedDate.value = date.addMonths(selectedDate.value, -1) as Date;
  fetchExpenses();
};

const nextMonth = () => {
  selectedDate.value = date.addMonths(selectedDate.value, 1) as Date;
  console.log(selectedDate.value);
  fetchExpenses();
};

const groupedExpenses = computed(() => {
  return expenses.value.reduce(
    (groups: Record<string, ExpenseEnriched[]>, expense) => {
      const dayDate = date.format(
        expense.expense.date,
        "normalDateWithWeekday"
      );

      if (!groups[dayDate]) {
        groups[dayDate] = [];
      }

      groups[dayDate].push(expense);

      return groups;
    },
    {}
  );
});
</script>

<template>
  <v-card>
    <div :class="$style.dateSelect">
      <v-btn icon="mdi-menu-left" variant="text" @click="previousMonth"></v-btn>

      <v-btn color="primary" width="160" @click="isCalendarOpen = true">
        {{ date.format(selectedDate, "monthAndYear") }}
      </v-btn>

      <v-btn icon="mdi-menu-right" variant="text" @click="nextMonth"></v-btn>
    </div>

    <v-dialog v-model="isCalendarOpen" max-width="290">
      <v-date-picker
        v-model="selectedDate"
        type="month"
        @change="fetchExpenses"
      />
    </v-dialog>

    <v-list :class="$style.list">
      <template v-for="(dailyExpenses, date) in groupedExpenses" :key="date">
        <v-list-subheader sticky :class="$style.dateHeader">
          {{ date }}
        </v-list-subheader>

        <ExpenseItem
          v-for="expense in dailyExpenses"
          :key="expense.expense._id"
          :expense="expense"
          @update:expense="fetchExpenses"
          @delete:expense="fetchExpenses"
        >
        </ExpenseItem>
      </template>
    </v-list>
  </v-card>
</template>

<style lang="scss" module>
.dateSelect {
  display: flex;
  justify-content: center;
  margin-top: 6px;
  align-items: center;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px 6px;
  max-height: calc(var(--content-height) - 54px);
}

.dateHeader {
  background: rgb(83 71 76);
}
</style>
