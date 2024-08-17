<script setup lang="ts">
import { useWalletStore } from "@/store/wallets";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import AddCategoryDialog from "./AddCategoryDialog.vue";
import Category from "./Category.vue";

const walletStore = useWalletStore();
const { categoriesTree } = storeToRefs(walletStore);
const isAddCategoryDialogOpen = ref<boolean>(false);

function openAddCategoryDialog() {
  isAddCategoryDialogOpen.value = true;
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-btn
        color="secondary"
        variant="elevated"
        @click="openAddCategoryDialog"
      >
        <template #prepend>
          <v-icon>mdi-expand-all</v-icon>
        </template>

        {{ $t("category.addCategory") }}
      </v-btn>
    </v-card-text>

    <v-list :class="$style.list">
      <template v-for="category in categoriesTree" :key="category._id">
        <Category
          :category="category"
          :delete-available="category.subCategories.length === 0"
        />

        <Category
          v-for="subCategory in category.subCategories"
          :key="subCategory._id"
          :category="subCategory"
          sub-category
        />
      </template>
    </v-list>
  </v-card>

  <AddCategoryDialog v-model:isOpen="isAddCategoryDialogOpen" />
</template>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 12px;
  max-height: calc(100vh - var(--v-layout-top) - 32px - 68px);

  :global(.v-list-group__items) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
    padding-left: 16px;
  }

  :global(.v-list-item) {
    background-color: rgba(var(--v-theme-primary), 0.25);
  }
}

.subCategory {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
}
</style>
