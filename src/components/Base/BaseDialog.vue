<script setup lang="ts">
import { computed } from "vue";

interface DialogProps {
  isOpen: boolean;
  title: string;
  titleIcon?: string;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(["update:isOpen"]);

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});
</script>

<template>
  <v-dialog v-model="showDialog" width="400" :class="$style.dialog">
    <v-card max-width="400" :prepend-icon="props.titleIcon">
      <template #title>
        <v-card-title :class="$style.multiLineTitle">
          {{ props.title }}
        </v-card-title>
      </template>

      <template #default>
        <slot />
      </template>

      <template v-if="$slots.actions" #actions>
        <div :class="$style.actions">
          <slot name="actions" />
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
.dialog {
  align-items: flex-start;

  :global(.v-card-item) {
    padding: 16px !important;
  }
}

.multiLineTitle {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px 8px;
}
</style>
