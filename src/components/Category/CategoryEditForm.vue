<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { Category } from "@/types/Category";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VForm } from "vuetify/components";
import ActionsWrapper from "../Base/ActionsWrapper.vue";

export type CategoryEditFormProps =
  | {
      type: "create";
    }
  | {
      type: "edit";
      category: Category;
    };

export type SubmitCategoryEditFormPayload = {
  categoryName: string;
  isSubCategory: boolean;
  selectedCategory: string;
  isIncomeCategory: boolean;
};

export type CategoryEditFormEmits = {
  "submit:form": (payload: SubmitCategoryEditFormPayload) => void;
};

// Triggers Vue Warning if type is "create" and category property is not provided
// Haven't found a way to fix this warning so far
const props = defineProps<CategoryEditFormProps>();
const emit = defineEmits(["submit:form"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { rootCategories, categories } = storeToRefs(walletStore);
const form = ref<typeof VForm | null>(null);
const categoryName = ref<string>("");
const valid = ref<boolean>(false);
const isSubCategory = ref<boolean>(false);
const selectedCategory = ref<string>("");
const isIncomeCategory = ref<boolean>(false);
const requiredField = required();

if (props.type === "edit") {
  categoryName.value = props.category.name;
  isSubCategory.value = !!props.category.parentCategory;
  selectedCategory.value = props.category.parentCategory || "";
  isIncomeCategory.value = props.category.isIncomeCategory;
}

const expenseCategories = computed(() =>
  rootCategories.value.filter((category) => !category.isIncomeCategory)
);

const incomeCategories = computed(() =>
  rootCategories.value.filter((category) => category.isIncomeCategory)
);

const categoriesOptions = computed(() => {
  const categoriesToSelect = isIncomeCategory.value
    ? incomeCategories.value
    : expenseCategories.value;

  const options = categoriesToSelect
    .map((category) => ({
      value: category._id,
      label: category.name,
    }))
    .reverse();

  if (props.type === "create") {
    return options;
  }

  const categoryId = props.category._id;

  return options.filter((option) => option.value !== categoryId);
});

const isCheckboxDisabled = computed(() => {
  if (props.type === "create") {
    return false;
  }

  if (props.category.parentCategory) {
    return false;
  }

  return categories.value.some((c) => c.parentCategory === props.category._id);
});

const checkboxHint = computed(() => {
  if (isCheckboxDisabled.value) {
    return t("category.hasSubCategories");
  }

  return "";
});

watch(isSubCategory, (value) => {
  if (value) {
    selectFirstCategory();
  }
});
watch(isIncomeCategory, () => {
  selectedCategory.value = "";
});

function selectFirstCategory() {
  const [firstCategory] = categoriesOptions.value;

  if (firstCategory) {
    selectedCategory.value = firstCategory.value;
  }
}

function submitForm() {
  emit("submit:form", {
    categoryName: categoryName.value,
    isSubCategory: isSubCategory.value,
    selectedCategory: selectedCategory.value || null,
    isIncomeCategory: isIncomeCategory.value,
  });

  if (props.type === "create" && form.value) {
    form.value.reset();
  }
}
</script>

<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-text-field
      v-model="categoryName"
      :label="t('category.categoryName')"
      hide-details="auto"
      :rules="[requiredField]"
    ></v-text-field>

    <v-checkbox
      v-if="categoriesOptions.length > 0"
      v-model="isSubCategory"
      :label="t('category.isSubCategory')"
      hide-details="auto"
      :disabled="isCheckboxDisabled"
      persistent-hint
      :hint="checkboxHint"
    ></v-checkbox>

    <div v-if="isSubCategory">
      <v-select
        v-model="selectedCategory"
        :items="categoriesOptions"
        :label="t('category.parentCategory')"
        no-data-text="category.noCategories"
        item-title="label"
        item-value="value"
        hide-details="auto"
        :rules="[requiredField]"
      ></v-select>
    </div>

    <v-checkbox
      v-model="isIncomeCategory"
      :label="t('category.isIncomeCategory')"
      hide-details="auto"
    />

    <br />

    <ActionsWrapper>
      <v-btn
        :disabled="!valid"
        type="submit"
        variant="elevated"
        color="primary"
      >
        {{ t("ui.save") }}
      </v-btn>

      <slot name="actions" />
    </ActionsWrapper>
  </v-form>
</template>
