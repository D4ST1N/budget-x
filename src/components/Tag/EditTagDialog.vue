<script setup lang="ts">
import TagCreation from "@/components/Tag/TagCreation.vue";
import { Tag } from "@/types/Tag";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

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
  <v-dialog v-model="showDialog" width="400">
    <v-card
      max-width="400"
      prepend-icon="mdi-file-edit"
      :title="t('tag.editTag')"
    >
      <template #default>
        <TagCreation :tag="props.tag" @update:tag="showDialog = false">
          <template #actions>
            <v-btn variant="text" @click="showDialog = false">
              {{ t("ui.close") }}
            </v-btn>
          </template>
        </TagCreation>
      </template>
    </v-card>
  </v-dialog>
</template>
