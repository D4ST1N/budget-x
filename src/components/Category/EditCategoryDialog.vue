<script setup lang="ts">
import CategoryCreation from "@/components/Category/CategoryCreation.vue";
import { Category } from "@/types/Category";
import { computed } from "vue";

export interface EditCategoryDialogProps {
  isOpen: boolean;
  category: Category;
}

const props = defineProps<EditCategoryDialogProps>();

const emit = defineEmits(["update:isOpen"]);

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});
</script>

<template>
  <v-dialog v-model="showDialog" width="400">
    <v-card
      max-width="400"
      prepend-icon="mdi-file-edit"
      :title="$t('category.editCategory')"
    >
      <template #default>
        <CategoryCreation
          :category="props.category"
          @update:category="showDialog = false"
        >
          <template #actions>
            <v-btn variant="text" @click="showDialog = false">
              {{ $t("ui.close") }}
            </v-btn>
          </template>
        </CategoryCreation>
      </template>
    </v-card>
  </v-dialog>
</template>
