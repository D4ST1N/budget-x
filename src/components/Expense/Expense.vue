<script setup lang="ts">
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { ExpenseEnriched } from "@/types/Expense";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ListItem from "../Base/ListItem.vue";
import EditExpenseDialog from "./EditExpenseDialog.vue";

export interface ExpenseProps {
  deleteAvailable?: boolean;
  editAvailable?: boolean;
  expense: ExpenseEnriched;
}

const emit = defineEmits(["update:expense", "delete:expense"]);
const props = withDefaults(defineProps<ExpenseProps>(), {
  deleteAvailable: true,
  editAvailable: true,
});
const { t, n } = useI18n();
const walletStore = useWalletStore();

const { currentAccessLevel } = storeToRefs(walletStore);
const isExpenseEditDialogOpen = ref<boolean>(false);

const editAllowed = computed(
  () =>
    hasAccess([AccessLevel.UpdateExpense], currentAccessLevel.value) &&
    props.editAvailable
);

const deleteAllowed = computed(
  () =>
    hasAccess([AccessLevel.DeleteExpense], currentAccessLevel.value) &&
    props.deleteAvailable
);

function removeExpense() {
  walletStore.deleteExpense(props.expense.expense._id);
  emit("delete:expense");
}

function onExpenseUpdate() {
  emit("update:expense");
}
</script>

<template>
  <ListItem
    :title="n(expense.expense.amount, 'currency')"
    :edit-allowed="editAllowed"
    :delete-allowed="deleteAllowed"
    :delete-title="t('expense.deleteExpense')"
    :delete-message="t('expense.deleteExpenseText')"
    @edit="() => (isExpenseEditDialogOpen = true)"
    @delete="removeExpense"
  >
    <template #default>
      <div :class="$style.chips">
        <v-chip density="comfortable" size="x-small" variant="flat">
          {{ expense.category.name }}
        </v-chip>

        <v-chip
          v-for="tag in expense.tags"
          :key="tag._id"
          density="comfortable"
          size="x-small"
          variant="outlined"
        >
          {{ tag.name }}
        </v-chip>
      </div>
    </template>
  </ListItem>

  <EditExpenseDialog
    v-model:is-open="isExpenseEditDialogOpen"
    :expense="expense.expense"
    @update:expense="onExpenseUpdate"
  />
</template>

<style lang="scss" module>
.chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
