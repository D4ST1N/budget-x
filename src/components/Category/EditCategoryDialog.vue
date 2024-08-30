<script setup lang="ts">
import { Category } from "@/types/Category";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";
import CategoryUpdate from "./CategoryUpdate.vue";

export interface EditCategoryDialogProps {
  isOpen: boolean;
  category: Category;
}

const props = defineProps<EditCategoryDialogProps>();
const emit = defineEmits(["update:isOpen"]);
const { t } = useI18n();

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('category.editCategory')"
    title-icon="mdi-file-edit"
  >
    <CategoryUpdate
      :category="props.category"
      @update:category="showDialog = false"
    >
      <template #actions>
        <CloseButton @click="showDialog = false" />
      </template>
    </CategoryUpdate>
  </BaseDialog>
</template>
