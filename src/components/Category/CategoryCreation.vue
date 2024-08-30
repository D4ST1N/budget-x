<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import CategoryEditForm, {
  SubmitCategoryEditFormPayload,
} from "./CategoryEditForm.vue";

const walletStore = useWalletStore();

async function createCategory(formPayload: SubmitCategoryEditFormPayload) {
  await walletStore.createCategory({
    name: formPayload.categoryName,
    parentCategory: formPayload.selectedCategory,
    isIncomeCategory: formPayload.isIncomeCategory,
  });
}
</script>

<template>
  <v-card-text>
    <CategoryEditForm
      type="create"
      :category="{}"
      @submit:form="createCategory"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </CategoryEditForm>
  </v-card-text>
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
