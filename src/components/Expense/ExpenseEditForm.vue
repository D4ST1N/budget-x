<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { Expense } from "@/types/Expense";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { VForm } from "vuetify/components";
import ActionsWrapper from "../Base/ActionsWrapper.vue";
import DateSelection from "../Base/DateSelection.vue";
import CategorySelect from "../Category/CategorySelect.vue";

export type CategoryEditFormProps = {
  confirmButtonLabel: string;
  isIncome?: boolean;
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
  tags: string[];
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
});
const emit = defineEmits(["submit:form"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { tags } = storeToRefs(walletStore);
const selectedDate = ref<Date>(new Date());
const selectedCategory = ref<string>("");
const selectedTags = ref<string[]>([]);
const amount = ref<number | undefined>();
const valid = ref<boolean>(false);
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

const tagsOptions = computed(() => tags.value.map((tag) => tag._id));

function submitForm() {
  emit("submit:form", {
    categoryId: selectedCategory.value,
    tags: selectedTags.value,
    amount: amount.value,
    date: selectedDate.value,
  });

  if (props.type === "create") {
    selectedTags.value = [];
    amount.value = undefined;
  }
}
</script>

<template>
  <v-form v-model="valid" @submit.prevent="submitForm">
    <DateSelection v-model:selected-date="selectedDate" />

    <CategorySelect
      v-model:selectedCategory="selectedCategory"
      :is-income="props.isIncome"
      :validations="[requiredField]"
    />

    <v-combobox
      v-model="selectedTags"
      :items="tagsOptions"
      :label="t('tag.tags')"
      :rules="[requiredField]"
      item-title="text"
      item-value="value"
      chips
      closable-chips
      multiple
      :class="$style.tagSelect"
    ></v-combobox>

    <v-text-field
      v-model="amount"
      :label="t('expense.amount')"
      type="number"
      :rules="[requiredField]"
      append-inner-icon="mdi-currency-uah"
    ></v-text-field>

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
.tagSelect {
  :global(.v-chip__close) {
    background-color: transparent;
  }
}
</style>
