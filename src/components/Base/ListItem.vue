<script setup lang="ts">
import { computed, useCssModule } from "vue";
import ConfirmDialog from "../Base/ConfirmDialog.vue";

export interface ListItemProps {
  title: string;
  density?: "compact" | "default";
  editAllowed: boolean;
  deleteAllowed: boolean;
  additionalClass?: string;
  deleteTitle: string;
  deleteMessage: string;
}

const props = withDefaults(defineProps<ListItemProps>(), {
  density: "default",
});
const emit = defineEmits(["edit", "delete"]);
const styles = useCssModule();

const itemClasses = computed(() => [styles.item, props.additionalClass]);
</script>

<template>
  <v-list-item :density="props.density" :class="itemClasses" rounded>
    <v-list-item-title>{{ props.title }}</v-list-item-title>

    <template #append>
      <v-btn
        v-if="editAllowed"
        icon="mdi-pencil"
        variant="text"
        size="small"
        @click="emit('edit')"
      ></v-btn>

      <ConfirmDialog
        v-if="deleteAllowed"
        :title="props.deleteTitle"
        :message="props.deleteMessage"
        :confirm="() => emit('delete')"
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

    <slot />
  </v-list-item>
</template>

<style lang="scss" module>
.item {
  background-color: var(--item-bg);
}
</style>
