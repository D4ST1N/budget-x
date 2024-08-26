<script setup lang="ts">
import WalletSettings from "@/components/Wallet/WalletSettings.vue";
import { useWalletStore } from "@/store/wallet";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ExpensesList from "../Expense/ExpensesList.vue";
import DashboardPanel from "./DashboardPanel.vue";

const { t } = useI18n();
const router = useRouter();
const walletStore = useWalletStore();

const { categories } = storeToRefs(walletStore);
const categoriesFetched = ref<boolean>(false);

const noCategoriesAdded = computed(() => categories.value.length === 0);

onMounted(async () => {
  await walletStore.waitForCategoriesLoaded();

  categoriesFetched.value = true;
});

function addExpenseClick() {
  router.push({ name: "AddExpense" });
}
</script>

<template>
  <div :class="$style.container">
    <WalletSettings :class="$style.header" />

    <ExpensesList :class="$style.main">
      <v-alert
        v-if="categoriesFetched && noCategoriesAdded"
        type="info"
        variant="tonal"
        density="compact"
        :class="$style.badge"
      >
        {{ t("category.noCategoriesAdded") }}
        <div :class="$style.badgeActions">
          <v-btn color="primary" variant="text" :to="{ name: 'Categories' }">
            <template #prepend>
              <v-icon>mdi-expand-all</v-icon>
            </template>
            {{ t("category.addCategories") }}
          </v-btn>
        </div>
      </v-alert>
    </ExpensesList>

    <DashboardPanel v-ripple :class="$style.expense" @click="addExpenseClick">
      <div :class="$style.tileButton">
        <v-icon size="48">mdi-cash</v-icon>
        <span>{{ t("wallet.addExpense") }}</span>
      </div>
    </DashboardPanel>

    <DashboardPanel v-ripple :class="$style.income">
      <div :class="$style.tileButton">
        <v-icon size="48">mdi-piggy-bank</v-icon>
        <span>{{ t("wallet.addIncome") }}</span>
      </div>
    </DashboardPanel>
  </div>
</template>

<style lang="scss" module>
.container {
  --dashboard-button-height: 0px;
  --dashboard-padding: 6px;
  --dashboard-header-height: 36px;
  --dashboard-badge-height: 0px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr var(--dashboard-button-height);
  grid-template-areas:
    "main main"
    "expense income";
  height: 100%;
  padding: var(--dashboard-padding);
  gap: 6px;

  &:has(.header:first-child) {
    --dashboard-button-height: 100px;

    grid-template-rows: var(--dashboard-header-height) 1fr var(
        --dashboard-button-height
      );
    grid-template-areas:
      "header header"
      "main main"
      "expense income";
  }

  &:has(.badge) {
    --dashboard-badge-height: 100px;
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

.badge {
  :global(.v-alert__prepend) {
    margin-top: 12px;
    align-self: center;
  }
}

.badgeActions {
  display: flex;
  justify-content: flex-end;
}
</style>
