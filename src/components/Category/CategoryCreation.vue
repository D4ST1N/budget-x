<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { Category, CategoryData } from "@/types/Category";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { VForm } from "vuetify/components";

export interface CategoryCreationProps {
  category?: Category;
}

const props = defineProps<CategoryCreationProps>();

const emit = defineEmits(["update:category"]);

const walletStore = useWalletStore();
const categoryName = ref<string>(props.category?.name || "");
const valid = ref<boolean>(false);
const isSubCategory = ref<boolean>(
  props.category?.parentCategory !== null || false
);
const selectedCategory = ref<string | null>(
  props.category?.parentCategory || null
);
const { rootCategories } = storeToRefs(walletStore);
const requiredField = required();

const form = ref<typeof VForm | null>(null);

const categoriesOptions = computed(() => {
  return rootCategories.value
    .map((category) => ({
      value: category._id,
      label: category.name,
    }))
    .reverse();
});

watch(isSubCategory, (value) => {
  if (value) {
    selectedCategory.value = categoriesOptions.value[0].value;
  }
});

async function createCategory() {
  const payload: CategoryData = {
    name: categoryName.value,
    parentCategory: isSubCategory.value ? selectedCategory.value : null,
  };
  let success: boolean;

  if (props.category) {
    success = await walletStore.updateCategory(payload, props.category._id);
  } else {
    success = await walletStore.createCategory(payload);
  }

  if (success && props.category) {
    emit("update:category");

    return;
  }

  if (success && form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
}
</script>

<template>
  <v-card-text>
    <v-form ref="form" v-model="valid" @submit.prevent="createCategory">
      <v-text-field
        v-model="categoryName"
        :label="$t('category.categoryName')"
        hide-details="auto"
        :rules="[requiredField]"
      ></v-text-field>

      <v-checkbox
        v-model="isSubCategory"
        :label="$t('category.isSubCategory')"
        hide-details
      ></v-checkbox>

      <div v-if="isSubCategory">
        <v-select
          v-model="selectedCategory"
          :items="categoriesOptions"
          :label="$t('category.parentCategory')"
          no-data-text="category.noCategories"
          item-title="label"
          item-value="value"
          hide-details="auto"
          :rules="[requiredField]"
        ></v-select>
      </div>

      <br />

      <div :class="$style.actions">
        <v-btn
          :disabled="!valid"
          type="submit"
          variant="elevated"
          color="primary"
        >
          {{ $t("ui.save") }}
        </v-btn>

        <slot name="actions" />
      </div>
    </v-form>
  </v-card-text>
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
