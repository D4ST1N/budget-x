<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { Resolution } from "@/types/Resolution";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CategorySelect from "./CategorySelect.vue";

interface CategoryUpdateConflictDialogProps {
  isOpen: boolean;
  categoryId: string;
  parentCategoryId?: string;
}

type CategoryDeleteConflictResolution =
  | Resolution.TransferToAnotherCategory
  | Resolution.TransferToNewCategory
  | Resolution.TransferToParentCategory
  | Resolution.DeleteExpenses;

const props = defineProps<CategoryUpdateConflictDialogProps>();
const emit = defineEmits(["update:isOpen", "confirm", "delete"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { categoriesTree } = storeToRefs(walletStore);
const conflictResolution = ref<CategoryDeleteConflictResolution>(
  Resolution.TransferToAnotherCategory
);
const selectedCategory = ref<string>("");
const newCategoryName = ref<string>("");

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

const parentCategory = computed(() => {
  if (!props.parentCategoryId) {
    return null;
  }

  return categoriesTree.value.find(
    (category) => category._id === props.parentCategoryId
  );
});

const isLastSubCategory = computed(() => {
  if (!parentCategory.value) {
    return false;
  }

  return parentCategory.value.subCategories.length === 1;
});

async function handleConfirm() {
  if (conflictResolution.value === Resolution.TransferToNewCategory) {
    emit("confirm", { categoryName: newCategoryName.value });
  } else if (
    conflictResolution.value === Resolution.TransferToAnotherCategory
  ) {
    emit("confirm", { categoryId: selectedCategory.value });
  } else if (conflictResolution.value === Resolution.TransferToParentCategory) {
    emit("confirm", { categoryId: parentCategory.value!._id });
  } else {
    emit("delete");
  }

  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('category.categoryHasExpenses')"
  >
    <v-card-text>
      <div class="mb-2">
        {{ t("category.categoryHasExpensesDescription") }}
      </div>

      <v-radio-group v-model="conflictResolution">
        <v-radio
          :label="t('category.transferToAnotherCategory')"
          :value="Resolution.TransferToAnotherCategory"
        ></v-radio>

        <v-radio
          :label="t('category.transferToNewCategory')"
          :value="Resolution.TransferToNewCategory"
        ></v-radio>

        <v-radio
          v-if="isLastSubCategory"
          :label="
            t('category.transferToParentCategory', {
              categoryName: parentCategory!.name,
            })
          "
          :value="Resolution.TransferToParentCategory"
        ></v-radio>

        <v-radio
          :label="t('category.deleteExpenses')"
          :value="Resolution.DeleteExpenses"
        ></v-radio>
      </v-radio-group>

      <CategorySelect
        v-if="conflictResolution === Resolution.TransferToParentCategory"
        v-model:selectedCategory="selectedCategory"
        label="category.category"
        :excluded-categories="[props.categoryId]"
      />

      <v-text-field
        v-if="conflictResolution === Resolution.TransferToNewCategory"
        v-model="newCategoryName"
        :label="t('category.newCategoryName')"
      />
    </v-card-text>

    <template #actions>
      <v-btn variant="elevated" color="primary" @click="handleConfirm">
        {{ t("ui.confirm") }}
      </v-btn>

      <v-btn variant="text" color="white" @click="showDialog = false">
        {{ t("ui.cancel") }}
      </v-btn>
    </template>
  </BaseDialog>
</template>
