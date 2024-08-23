<script setup lang="ts">
import EditCategoryDialog from "@/components/Category/EditCategoryDialog.vue";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { Category } from "@/types/Category";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ListItem from "../Base/ListItem.vue";

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

const { currentAccessLevel } = storeToRefs(walletStore);
const isEditDialogOpen = ref<boolean>(false);

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
    @edit="isEditDialogOpen = true"
    @delete="removeCategory"
  >
  </ListItem>

  <EditCategoryDialog
    v-model:is-open="isEditDialogOpen"
    :category="props.category"
  />
</template>

<style lang="scss" module>
.subCategory {
  margin-left: 16px;
  background-color: var(--sub-item-bg);
}
</style>
