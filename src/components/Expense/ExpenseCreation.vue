<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import ExpenseEditForm, {
  SubmitExpenseEditFormPayload,
} from "./ExpenseEditForm.vue";

const emit = defineEmits(["update:expense"]);
const walletStore = useWalletStore();

async function createExpense(formPayload: SubmitExpenseEditFormPayload) {
  const tags = await walletStore.createTags(formPayload.tagNames);

  if (!tags) {
    return;
  }

  await walletStore.createExpense({
    categoryId: formPayload.categoryId,
    tagIds: tags.map((tag) => tag._id),
    amount: formPayload.amount,
    date: formPayload.date,
    isIncome: false,
  });
}

async function createMultipleExpenses(parts: SubmitExpenseEditFormPayload[]) {
  const tags = await walletStore.createTags(
    parts.reduce((acc, part) => acc.concat(part.tagNames), [] as string[])
  );

  if (!tags) {
    return;
  }

  await walletStore.createExpensesBulk(
    parts.map((part) => ({
      categoryId: part.categoryId,
      tagIds: part.tagNames.map(
        (tagName) => tags.find((tag) => tag.name === tagName)!._id
      ),
      amount: part.amount,
      date: part.date,
      isIncome: false,
    }))
  );
}
</script>

<template>
  <v-card-text>
    <ExpenseEditForm
      type="create"
      :expense="{}"
      confirmButtonLabel="ui.add"
      @submit:form="createExpense"
      @submit:form-multiple="createMultipleExpenses"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </ExpenseEditForm>
  </v-card-text>
</template>
