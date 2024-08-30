<script setup lang="ts">
import EditCategoryDialog from "@/components/Category/EditCategoryDialog.vue";
import { CustomError } from "@/helpers/handleServerError";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { deleteExpensesBulkAction } from "@/store/walletActions/deleteExpensesBulkAction";
import { transferExpensesAction } from "@/store/walletActions/transferExpensesAction";
import { AccessLevel } from "@/types/AccessLevel";
import { Category } from "@/types/Category";
import { ErrorType } from "@/types/ErrorType";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ListItem from "../Base/ListItem.vue";
import CategoryDeleteConflictDialog from "./CategoryDeleteConflictDialog.vue";

export interface CategoryProps {
  subCategory?: boolean;
  deleteAvailable?: boolean;
  category: Category;
}

const props = withDefaults(defineProps<CategoryProps>(), {
  subCategory: false,
  deleteAvailable: true,
});
const { t } = useI18n();
const walletStore = useWalletStore();

const { currentAccessLevel, currentWallet } = storeToRefs(walletStore);
const isEditDialogOpen = ref<boolean>(false);
const isCategoryDeleteConflictDialogOpen = ref<boolean>(false);

const editAllowed = computed(() =>
  hasAccess([AccessLevel.UpdateCategory], currentAccessLevel.value)
);

const deleteAllowed = computed(
  () =>
    hasAccess([AccessLevel.DeleteCategory], currentAccessLevel.value) &&
    props.deleteAvailable
);

async function removeCategory() {
  try {
    await walletStore.deleteCategory(props.category._id);
  } catch (error: unknown) {
    if (
      error instanceof CustomError &&
      error.errorType === ErrorType.CategoryHasExpenses
    ) {
      isCategoryDeleteConflictDialogOpen.value = true;
    } else {
      console.error((error as Error).message);
    }
  }
}

type ConflictResolutionProps =
  | {
      categoryName: string;
    }
  | {
      categoryId: string;
    };

async function handleCategoryDeleteConflictResolution(
  payload: ConflictResolutionProps
) {
  if (!currentWallet.value) {
    return;
  }

  const targetPayload =
    "categoryName" in payload
      ? {
          categoryName: payload.categoryName,
          parentCategory: props.category.parentCategory,
        }
      : { toCategoryId: payload.categoryId };

  const updatedExpenses = await transferExpensesAction({
    walletId: currentWallet.value._id,
    fromCategoryId: props.category._id,
    ...targetPayload,
  });

  if (!updatedExpenses) {
    return;
  }

  removeCategory();
}

async function removeExpenses() {
  await deleteExpensesBulkAction({
    walletId: currentWallet.value!._id,
    categoryId: props.category._id,
  });

  removeCategory();
}
</script>

<template>
  <ListItem
    :title="props.category.name"
    :edit-allowed="editAllowed"
    :delete-allowed="deleteAllowed"
    :delete-title="t('tag.deleteTag')"
    :delete-message="
      t('tag.removeTagMessage', {
        tag: props.category.name,
      })
    "
    :density="props.subCategory ? 'compact' : 'default'"
    :additional-class="props.subCategory ? $style.subCategory : undefined"
    :class="{ [$style.incomeCategory]: props.category.isIncomeCategory }"
    @edit="isEditDialogOpen = true"
    @delete="removeCategory"
  >
  </ListItem>

  <EditCategoryDialog
    v-model:is-open="isEditDialogOpen"
    :category="props.category"
  />
  <CategoryDeleteConflictDialog
    v-model:is-open="isCategoryDeleteConflictDialogOpen"
    :category-id="props.category._id"
    @confirm="handleCategoryDeleteConflictResolution"
    @delete="removeExpenses"
  />
</template>

<style lang="scss" module>
.subCategory {
  margin-left: 16px;
  background-color: var(--sub-item-bg);
}

.incomeCategory {
  --item-bg: rgba(var(--v-theme-secondary), 0.25);
  --sub-item-bg: rgba(var(--v-theme-secondary), 0.15);
}
</style>
