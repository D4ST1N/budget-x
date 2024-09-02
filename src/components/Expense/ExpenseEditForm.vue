<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { limitDecimals } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { Expense, ExpenseEditData } from "@/types/Expense";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VForm } from "vuetify/components";
import ActionsWrapper from "../Base/ActionsWrapper.vue";
import DateSelection from "../Base/DateSelection.vue";
import CategorySelect from "../Category/CategorySelect.vue";
import TagSelect from "../Tag/TagSelect.vue";
import SplitExpense from "./SplitExpense.vue";

export type CategoryEditFormProps = {
  confirmButtonLabel: string;
  isIncome?: boolean;
  splitExpense?: boolean;
  showDate?: boolean;
  maxAmount?: number;
} & (
  | {
      type: "create";
    }
  | {
      type: "edit";
      expense: Expense;
    }
);

export type SubmitExpenseEditFormPayload = {
  categoryId: string;
  tagNames: string[];
  amount: number;
  date: Date;
};

export type ExpenseEditFormEmits = {
  "submit:form": [payload: SubmitExpenseEditFormPayload];
};

// Triggers Vue Warning if type is "create" and category property is not provided
// Haven't found a way to fix this warning so far
const props = withDefaults(defineProps<CategoryEditFormProps>(), {
  isIncome: false,
  splitExpense: true,
  showDate: true,
});
const emit = defineEmits(["submit:form", "submit:form-multiple"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { tags } = storeToRefs(walletStore);
const selectedDate = ref<Date>(new Date());
const selectedCategory = ref<string>("");
const selectedTags = ref<string[]>([]);
const amount = ref<number | undefined>();
const valid = ref<boolean>(false);
const parts = ref<ExpenseEditData[]>([]);
const requiredField = required();

if (props.type === "edit") {
  amount.value = props.expense.amount;
  selectedCategory.value = props.expense.categoryId;
  selectedTags.value = props.expense.tagIds.map((tagId) => {
    const tag = tags.value.find((t) => t._id === tagId)!;

    return tag.name;
  });
  selectedDate.value = new Date(props.expense.date);
}

const amountHint = computed(() => {
  return props.maxAmount
    ? t("expense.minMaxAmountHint", { max: props.maxAmount, min: 1 })
    : t("expense.minAmountHint", { min: 1 });
});

const expenseEditData = computed(() => {
  return {
    categoryId: selectedCategory.value,
    tagNames: selectedTags.value,
    amount: amount.value!,
    date: selectedDate.value,
  };
});

watch(amount, (value: number | undefined) => {
  if (value === undefined) {
    return;
  }

  amount.value = limitDecimals(value, 2);
});

function submitForm() {
  if (parts.value.length) {
    emit("submit:form-multiple", parts.value);
  } else {
    emit("submit:form", expenseEditData.value);
  }

  if (props.type === "create") {
    selectedTags.value = [];
    amount.value = undefined;
    parts.value = [];
  }
}
</script>

<template>
  <v-form v-model="valid" :class="$style.form" @submit.prevent="submitForm">
    <DateSelection v-if="props.showDate" v-model:selected-date="selectedDate" />

    <v-number-input
      v-model="amount"
      :label="t('expense.amount')"
      type="number"
      :min="1"
      :max="props.maxAmount"
      inset
      :rules="[requiredField]"
      :hint="amountHint"
      persistent-hint
      append-inner-icon="mdi-currency-uah"
    >
      <template #increment>
        <span></span>
      </template>

      <template #decrement>
        <span></span>
      </template>
    </v-number-input>

    <CategorySelect
      v-model:selectedCategory="selectedCategory"
      :is-income="props.isIncome"
      :validations="[requiredField]"
    />

    <TagSelect v-model:tags="selectedTags" />

    <SplitExpense
      v-if="props.splitExpense && !props.isIncome"
      v-model:parts="parts"
      :expense="expenseEditData"
      :disabled="!amount || !selectedCategory"
    />

    <v-divider></v-divider>
    <br />

    <ActionsWrapper>
      <v-btn
        :disabled="!valid"
        type="submit"
        variant="elevated"
        color="primary"
      >
        {{ t(props.confirmButtonLabel) }}
      </v-btn>

      <slot name="actions" />
    </ActionsWrapper>
  </v-form>
</template>

<style lang="scss" module>
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
