<script setup lang="ts">
import CategoryCreation from "@/components/Category/CategoryCreation.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isOpen: Boolean,
});

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
      prepend-icon="mdi-expand-all"
      :title="t('category.addCategory')"
    >
      <template #default>
        <CategoryCreation>
          <template #actions>
            <v-btn variant="text" @click="showDialog = false">
              {{ t("ui.close") }}
            </v-btn>
          </template>
        </CategoryCreation>
      </template>
    </v-card>
  </v-dialog>
</template>
