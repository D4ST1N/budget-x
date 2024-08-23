<script setup lang="ts">
import { Expense } from "@/types/Expense";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";
import AddExpense from "./AddExpense.vue";

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

function onExpenseUpdate() {
  emit("update:expense");
  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('expense.editExpense')"
    title-icon="mdi-file-edit"
  >
    <AddExpense
      :expense="props.expense"
      confirm-button-label="ui.save"
      @update:expense="onExpenseUpdate"
    >
      <template #actions>
        <CloseButton @click="showDialog = false" />
      </template>
    </AddExpense>
  </BaseDialog>
</template>
