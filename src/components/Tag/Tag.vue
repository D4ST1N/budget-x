<script setup lang="ts">
import EditTagDialog from "@/components/Tag/EditTagDialog.vue";
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { Tag } from "@/types/Tag";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ListItem from "../Base/ListItem.vue";

export interface TagProps {
  deleteAvailable?: boolean;
  tag: Tag;
}

const props = withDefaults(defineProps<TagProps>(), {
  deleteAvailable: true,
});
const { t } = useI18n();
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
  <ListItem
    :title="props.tag.name"
    :edit-allowed="editAllowed"
    :delete-allowed="deleteAllowed"
    :delete-title="t('tag.deleteTag')"
    :delete-message="
      t('tag.removeTagMessage', {
        tag: props.tag.name,
      })
    "
    @edit="isEditDialogOpen = true"
    @delete="removeTag"
  >
  </ListItem>

  <EditTagDialog v-model:is-open="isEditDialogOpen" :tag="props.tag" />
</template>
