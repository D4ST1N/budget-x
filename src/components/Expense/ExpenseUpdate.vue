<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { Expense } from "@/types/Expense";
import ExpenseEditForm, {
  SubmitExpenseEditFormPayload,
} from "./ExpenseEditForm.vue";

interface AddExpenseProps {
  expense: Expense;
}

const emit = defineEmits(["update:expense"]);
const props = defineProps<AddExpenseProps>();
const walletStore = useWalletStore();

async function updateExpense(formPayload: SubmitExpenseEditFormPayload) {
  const tags = await walletStore.createTags(formPayload.tagNames);

  if (!tags) {
    return;
  }

  await walletStore.updateExpense(
    {
      categoryId: formPayload.categoryId,
      tagIds: tags.map((tag) => tag._id),
      amount: formPayload.amount,
      date: formPayload.date,
      isIncome: props.expense.isIncome,
    },
    props.expense._id
  );

  emit("update:expense");
}
</script>

<template>
  <v-card-text>
    <ExpenseEditForm
      type="edit"
      :expense="props.expense"
      :is-income="props.expense.isIncome"
      confirmButtonLabel="ui.save"
      @submit:form="updateExpense"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </ExpenseEditForm>
  </v-card-text>
</template>
