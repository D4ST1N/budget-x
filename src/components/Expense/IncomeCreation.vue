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
    isIncome: true,
  });
}
</script>

<template>
  <v-card-text>
    <ExpenseEditForm
      type="create"
      confirmButtonLabel="ui.add"
      :is-income="true"
      @submit:form="createExpense"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </ExpenseEditForm>
  </v-card-text>
</template>
