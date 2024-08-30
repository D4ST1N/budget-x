<script setup lang="ts">
import { Expense } from "@/types/Expense";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";
import ExpenseUpdate from "./ExpenseUpdate.vue";

export interface EditExpenseDialogProps {
  isOpen: boolean;
  expense: Expense;
}

const props = defineProps<EditExpenseDialogProps>();
const emit = defineEmits(["update:isOpen", "update:expense"]);
const { t } = useI18n();

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

const title = computed(() =>
  props.expense.isIncome ? t("income.editIncome") : t("expense.editExpense")
);

function onExpenseUpdate() {
  emit("update:expense");
  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="title"
    title-icon="mdi-file-edit"
  >
    <ExpenseUpdate :expense="props.expense" @update:expense="onExpenseUpdate">
      <template #actions>
        <CloseButton @click="showDialog = false" />
      </template>
    </ExpenseUpdate>
  </BaseDialog>
</template>
