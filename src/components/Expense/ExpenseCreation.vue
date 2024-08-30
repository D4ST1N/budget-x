<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import ExpenseEditForm, {
  SubmitExpenseEditFormPayload,
} from "./ExpenseEditForm.vue";

const emit = defineEmits(["update:expense"]);
const walletStore = useWalletStore();

async function createExpense(formPayload: SubmitExpenseEditFormPayload) {
  const tags = await walletStore.createTags(formPayload.tags);

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
</script>

<template>
  <v-card-text>
    <ExpenseEditForm
      type="create"
      :expense="{}"
      confirmButtonLabel="ui.add"
      @submit:form="createExpense"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </ExpenseEditForm>
  </v-card-text>
</template>
