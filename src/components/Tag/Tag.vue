<script setup lang="ts">
import EditTagDialog from "@/components/Tag/EditTagDialog.vue";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { Tag } from "@/types/Tag";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ConfirmDialog from "../Dialog/ConfirmDialog.vue";

export interface TagProps {
  deleteAvailable?: boolean;
  tag: Tag;
}

const props = withDefaults(defineProps<TagProps>(), {
  deleteAvailable: true,
});
const walletStore = useWalletStore();
const { currentAccessLevel } = storeToRefs(walletStore);

const isEditDialogOpen = ref<boolean>(false);

const editAllowed = computed(() =>
  hasAccess([AccessLevel.UpdateTag], currentAccessLevel.value)
);

const deleteAllowed = computed(
  () =>
    hasAccess([AccessLevel.DeleteTag], currentAccessLevel.value) &&
    props.deleteAvailable
);

function removeTag() {
  walletStore.deleteTag(props.tag._id);
}
</script>

<template>
  <v-list-item :title="props.tag.name" :class="$style.tag" rounded>
    <template #append>
      <v-btn
        v-if="editAllowed"
        icon="mdi-pencil"
        variant="text"
        size="small"
        @click="isEditDialogOpen = true"
      ></v-btn>

      <ConfirmDialog
        v-if="deleteAllowed"
        :title="$t('tag.deleteTag')"
        :message="
          $t('tag.removeTagMessage', {
            tag: props.tag.name,
          })
        "
        :confirm="removeTag"
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

    <EditTagDialog v-model:is-open="isEditDialogOpen" :tag="props.tag" />
  </v-list-item>
</template>

<style lang="scss" module>
.tag {
  background-color: rgba(var(--v-theme-primary), 0.25);
}
</style>
