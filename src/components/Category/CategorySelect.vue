<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { InternalItem, SelectOption } from "@/types/SelectOption";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

type ValidationRule = (v: string) => string | boolean;

type CategorySelectProps = {
  selectedCategory: string;
  excludedCategories?: string[];
  validations?: ValidationRule[];
  label?: string;
  isIncome?: boolean;
};

const { t } = useI18n();
const emit = defineEmits(["update:selected-category"]);
const props = withDefaults(defineProps<CategorySelectProps>(), {
  label: "category.category",
  isIncome: false,
});
const walletStore = useWalletStore();

const { categoriesTree } = storeToRefs(walletStore);

const expenseCategories = computed(() =>
  categoriesTree.value.filter((category) => !category.isIncomeCategory)
);

const incomeCategories = computed(() =>
  categoriesTree.value.filter((category) => category.isIncomeCategory)
);

const categoriesOptions = computed(() => {
  const categories = props.isIncome
    ? incomeCategories.value
    : expenseCategories.value;

  return categories
    .reduce((acc, category) => {
      if (category.subCategories.length) {
        acc.push(
          ...category.subCategories.map((child) => ({
            parent: category.name,
            text: child.name,
            value: child._id,
          }))
        );
      } else {
        acc.push({
          text: category.name,
          value: category._id,
        });
      }

      return acc;
    }, [] as SelectOption[])
    .filter(
      (option) =>
        !props.excludedCategories ||
        !props.excludedCategories.includes(option.value)
    );
});

const selectedCategory = computed({
  get: () => props.selectedCategory,
  set: (value) => emit("update:selected-category", value),
});

function filterResults(
  itemText: string,
  query: string,
  item?: InternalItem<SelectOption>
) {
  if (!item) {
    return false;
  }

  const hasParent =
    item.raw.parent &&
    item.raw.parent.toLowerCase().includes(query.toLowerCase());
  const hasText = itemText.toLowerCase().includes(query.toLowerCase());

  return hasParent || hasText;
}
</script>

<template>
  <v-autocomplete
    v-model="selectedCategory"
    :items="categoriesOptions"
    :label="t(props.label)"
    :rules="validations"
    :custom-filter="filterResults"
    item-title="text"
    item-value="value"
    clearable
  >
    <template #item="{ item, props }">
      <v-list-item v-bind="props" :title="''">
        <v-list-item-title>
          <template v-if="item.raw.parent">
            <span>{{ item.raw.parent }}</span> /
          </template>
          <span class="text-primary">{{ item.title }}</span>
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
