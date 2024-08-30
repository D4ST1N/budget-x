<script setup lang="ts">
import { CustomErrorGuard } from "@/helpers/handleServerError";
import { useWalletStore } from "@/store/wallet";
import { transferExpensesAction } from "@/store/walletActions/transferExpensesAction";
import { Category } from "@/types/Category";
import { ErrorType } from "@/types/ErrorType";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import CategoryEditForm, {
  SubmitCategoryEditFormPayload,
} from "./CategoryEditForm.vue";
import CategoryUpdateConflictDialog from "./CategoryUpdateConflictDialog.vue";

export interface CategoryCreationProps {
  category: Category;
}

const props = defineProps<CategoryCreationProps>();
const emit = defineEmits(["update:category"]);
const walletStore = useWalletStore();

const isCategoryUpdateConflictDialogOpen = ref<boolean>(false);
const { currentWallet } = storeToRefs(walletStore);
const categoryUpdatePayload = ref<SubmitCategoryEditFormPayload>();

async function updateCategory(formPayload: SubmitCategoryEditFormPayload) {
  try {
    const updatedCategory = await walletStore.updateCategory(
      {
        name: formPayload.categoryName,
        parentCategory: formPayload.selectedCategory,
        isIncomeCategory: formPayload.isIncomeCategory,
      },
      props.category._id
    );

    if (!updatedCategory) {
      return;
    }

    emit("update:category");
  } catch (error: unknown) {
    CustomErrorGuard(error, ErrorType.ParentCategoryHasExpenses, () => {
      categoryUpdatePayload.value = formPayload;
      isCategoryUpdateConflictDialogOpen.value = true;
    });
  }
}

async function transferExpenses(categoryName?: string) {
  if (!currentWallet.value) {
    return;
  }

  const fromCategoryId = categoryUpdatePayload.value!.selectedCategory;
  const targetPayload = categoryName
    ? { categoryName: categoryName, parentCategory: fromCategoryId }
    : { toCategoryId: props.category?._id };

  const updatedExpenses = await transferExpensesAction({
    walletId: currentWallet.value._id,
    fromCategoryId,
    ...targetPayload,
  });

  if (!updatedExpenses) {
    return;
  }

  updateCategory(categoryUpdatePayload.value!);
}
</script>

<template>
  <v-card-text>
    <CategoryEditForm
      type="edit"
      :category="props.category"
      @submit:form="updateCategory"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </CategoryEditForm>
  </v-card-text>

  <CategoryUpdateConflictDialog
    v-if="categoryUpdatePayload"
    v-model:is-open="isCategoryUpdateConflictDialogOpen"
    :category-name="categoryUpdatePayload.categoryName"
    :parent-category-id="categoryUpdatePayload.selectedCategory"
    @confirm="transferExpenses"
  />
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
