<script setup lang="ts">
import TagCreation from "@/components/Tag/TagCreation.vue";
import { Tag } from "@/types/Tag";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "../Base/BaseDialog.vue";
import CloseButton from "../Base/CloseButton.vue";

export interface EditTagDialogProps {
  isOpen: boolean;
  tag: Tag;
}

const props = defineProps<EditTagDialogProps>();
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
    :title="t('tag.editTag')"
    title-icon="mdi-file-edit"
  >
    <TagCreation :tag="props.tag" @update:tag="showDialog = false">
      <template #actions>
        <CloseButton @click="showDialog = false" />
      </template>
    </TagCreation>
  </BaseDialog>
</template>
