<script setup lang="ts">
import TagCreation from "@/components/Tag/TagCreation.vue";
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
});

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
      prepend-icon="mdi-expand-all"
      :title="$t('tag.addTag')"
    >
      <template #default>
        <TagCreation>
          <template #actions>
            <v-btn variant="text" @click="showDialog = false">
              {{ $t("ui.close") }}
            </v-btn>
          </template>
        </TagCreation>
      </template>
    </v-card>
  </v-dialog>
</template>
