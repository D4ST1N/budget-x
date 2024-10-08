<script setup lang="ts">
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import AddCategoryDialog from "./AddCategoryDialog.vue";
import Category from "./Category.vue";

const { t } = useI18n();
const walletStore = useWalletStore();

const { categoriesTree, currentAccessLevel } = storeToRefs(walletStore);
const isAddCategoryDialogOpen = ref<boolean>(false);

const addCategoryAllowed = computed(() => {
  return hasAccess([AccessLevel.CreateCategory], currentAccessLevel.value);
});

function openAddCategoryDialog() {
  isAddCategoryDialogOpen.value = true;
}
</script>

<template>
  <v-card
    :class="{
      [$style.card]: true,
      [$style.createDisabled]: !addCategoryAllowed,
    }"
  >
    <v-card-text v-if="addCategoryAllowed">
      <v-btn
        color="secondary"
        variant="elevated"
        @click="openAddCategoryDialog"
      >
        <template #prepend>
          <v-icon>mdi-expand-all</v-icon>
        </template>

        {{ t("category.addCategory") }}
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
.card {
  --button-block-height: 68px;

  &.createDisabled {
    --button-block-height: 0px;
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 12px;
  max-height: calc(var(--content-height) - var(--button-block-height));

  :global(.v-list-group__items) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
    padding-left: 16px;
  }
}
</style>
