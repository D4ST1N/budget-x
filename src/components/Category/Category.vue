<script setup lang="ts">
import EditCategoryDialog from "@/components/Category/EditCategoryDialog.vue";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { Category } from "@/types/Category";
import { storeToRefs } from "pinia";
import { computed, ref, useCssModule } from "vue";
import { useI18n } from "vue-i18n";
import ConfirmDialog from "../Dialog/ConfirmDialog.vue";

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
const styles = useCssModule();
const walletStore = useWalletStore();

const { currentAccessLevel } = storeToRefs(walletStore);

const isEditDialogOpen = ref<boolean>(false);

const categoryStyles = computed(() => ({
  [styles.category]: true,
  [styles.subCategory]: props.subCategory,
}));

const editAllowed = computed(() =>
  hasAccess([AccessLevel.UpdateCategory], currentAccessLevel.value)
);

const deleteAllowed = computed(
  () =>
    hasAccess([AccessLevel.DeleteCategory], currentAccessLevel.value) &&
    props.deleteAvailable
);

function removeCategory() {
  walletStore.deleteCategory(props.category._id);
}
</script>

<template>
  <v-list-item
    :title="props.category.name"
    :density="props.subCategory ? 'compact' : 'default'"
    :class="categoryStyles"
    rounded
  >
    <template #append>
      <v-btn
        v-if="editAllowed"
        icon="mdi-pencil"
        variant="text"
        size="small"
        @click="isEditDialogOpen = true"
      ></v-btn>

      <ConfirmDialog
        v-if="deleteAllowed"
        :title="t('category.deleteCategory')"
        :message="
          t('category.removeCategoryMessage', {
            category: props.category.name,
          })
        "
        :confirm="removeCategory"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            color="error"
            icon="mdi-delete-alert"
            variant="text"
            size="small"
          ></v-btn>
        </template>
      </ConfirmDialog>
    </template>

    <EditCategoryDialog
      v-model:is-open="isEditDialogOpen"
      :category="props.category"
    />
  </v-list-item>
</template>

<style lang="scss" module>
.category {
  background-color: rgba(var(--v-theme-primary), 0.25);

  &.subCategory {
    margin-left: 16px;
    background-color: rgba(var(--v-theme-primary), 0.15) !important;
  }
}
</style>
