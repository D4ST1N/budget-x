<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { ExpenseEditData } from "@/types/Expense";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";
import ExpenseEditForm from "./ExpenseEditForm.vue";
import ExpensePart from "./ExpensePart.vue";

type SplitExpenseProps = {
  parts: ExpenseEditData[];
  expense: ExpenseEditData;
  disabled?: boolean;
};

const props = withDefaults(defineProps<SplitExpenseProps>(), {
  disabled: false,
});
const emit = defineEmits(["update:parts"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const showDialog = ref<boolean>(false);
const showAddPartDialog = ref<boolean>(false);
const parts = ref<ExpenseEditData[]>([]);
const totalAmount = ref<number>(props.expense.amount);

const partsAmount = computed(() => {
  return parts.value.reduce((acc, part) => acc + part.amount, 0);
});

const mainPart = computed(() => {
  return {
    ...props.expense,
    amount: totalAmount.value - partsAmount.value,
  };
});

const maxValue = computed(() => {
  return totalAmount.value - partsAmount.value - 1;
});

const allParts = computed(() => [
  mainPart.value,
  ...parts.value.map((part) => ({ ...part, date: mainPart.value.date })),
]);

const categories = computed(() => {
  const uniqueCategories = new Set(
    allParts.value.map(
      (part) => walletStore.categoryById(part.categoryId)?.name
    )
  );

  return Array.from(uniqueCategories).join(", ");
});

watch(showDialog, (value) => {
  if (value) {
    totalAmount.value = props.expense.amount;
  }
});

function addPart() {
  showAddPartDialog.value = true;
}

function onAddPartSubmit(part: ExpenseEditData) {
  parts.value.push(part);
  showAddPartDialog.value = false;
}

function submitParts() {
  emit("update:parts", allParts.value);
  showDialog.value = false;
}
</script>

<template>
  <div>
    <v-btn
      :disabled="props.disabled"
      color="secondary"
      block
      @click="showDialog = true"
    >
      {{ t("expense.splitExpense") }}
    </v-btn>

    <div v-if="disabled" class="text-caption text-primary">
      {{ t("expense.splitDisabledHint") }}
    </div>

    <div v-if="parts.length && categories" class="text-caption text-primary">
      {{ t("expense.splitInto", { categories }) }}
    </div>
  </div>

  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('expense.splitExpense')"
    title-icon="mdi-file-edit"
  >
    <v-card-text>
      <v-list :class="$style.list">
        <ExpensePart :part="mainPart" main />

        <ExpensePart v-for="(part, index) in parts" :key="index" :part="part" />

        <v-list-item>
          <v-btn
            color="primary"
            variant="text"
            prepend-icon="mdi-plus"
            @click="addPart"
          >
            {{ t("expense.addPart") }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card-text>

    <template #actions>
      <v-btn color="primary" variant="elevated" @click="submitParts">
        {{ t("ui.confirm") }}
      </v-btn>

      <v-btn color="primary" variant="text" @click="showDialog = false">
        {{ t("ui.cancel") }}
      </v-btn>
    </template>
  </BaseDialog>

  <BaseDialog
    v-model:isOpen="showAddPartDialog"
    :title="t('expense.newExpense')"
    title-icon="mdi-file-edit"
  >
    <v-card-text>
      <ExpenseEditForm
        type="create"
        :expense="{}"
        :show-date="false"
        :split-expense="false"
        :max-amount="maxValue"
        confirmButtonLabel="ui.add"
        @submit:form="onAddPartSubmit"
      >
        <template #actions>
          <CloseButton @click="showAddPartDialog = false" />
        </template>
      </ExpenseEditForm>
    </v-card-text>
  </BaseDialog>
</template>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.subtitle {
  color: rgba(var(--v-theme-secondary-on-base));
}
</style>
