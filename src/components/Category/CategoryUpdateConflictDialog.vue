<script setup lang="ts">
import { Resolution } from "@/types/Resolution";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";

interface CategoryUpdateConflictDialogProps {
  isOpen: boolean;
  categoryName: string;
  parentCategoryId: string;
}

type CategoryUpdateConflictResolution =
  | Resolution.TransferToCurrentCategory
  | Resolution.TransferToNewCategory;

const props = defineProps<CategoryUpdateConflictDialogProps>();
const emit = defineEmits(["update:isOpen", "confirm"]);
const { t } = useI18n();

const conflictResolution = ref<CategoryUpdateConflictResolution>(
  Resolution.TransferToCurrentCategory
);
const newCategoryName = ref<string>("");

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

async function handleConfirm() {
  if (conflictResolution.value === Resolution.TransferToNewCategory) {
    emit("confirm", newCategoryName.value);
  } else {
    emit("confirm");
  }

  showDialog.value = false;
}
</script>

<template>
  <BaseDialog
    v-model:isOpen="showDialog"
    :title="t('category.parentCategoryHasExpenses')"
  >
    <v-card-text>
      <div class="mb-2">
        {{ t("category.parentCategoryHasExpensesDescription") }}
      </div>

      <v-radio-group v-model="conflictResolution">
        <v-radio
          :label="
            t('category.transferToCurrentCategory', {
              categoryName: props.categoryName,
            })
          "
          :value="Resolution.TransferToCurrentCategory"
        ></v-radio>

        <v-radio
          :label="t('category.transferToNewCategory')"
          :value="Resolution.TransferToNewCategory"
        ></v-radio>
      </v-radio-group>

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
