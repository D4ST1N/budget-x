<script setup lang="ts">
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import AddTagDialog from "./AddTagDialog.vue";
import Tag from "./Tag.vue";

const { t } = useI18n();
const walletStore = useWalletStore();

const { tags, currentAccessLevel } = storeToRefs(walletStore);
const isAddTagDialogOpen = ref<boolean>(false);

const addTagAllowed = computed(() => {
  return hasAccess([AccessLevel.CreateTag], currentAccessLevel.value);
});

function openAddTagDialog() {
  isAddTagDialogOpen.value = true;
}
</script>

<template>
  <v-card
    :class="{
      [$style.card]: true,
      [$style.createDisabled]: !addTagAllowed,
    }"
  >
    <v-card-text v-if="addTagAllowed">
      <v-btn color="secondary" variant="elevated" @click="openAddTagDialog">
        <template #prepend>
          <v-icon>mdi-expand-all</v-icon>
        </template>

        {{ t("tag.addTag") }}
      </v-btn>
    </v-card-text>

    <v-list :class="$style.list">
      <Tag v-for="tag in tags" :key="tag._id" :tag="tag" />
    </v-list>
  </v-card>

  <AddTagDialog v-model:isOpen="isAddTagDialogOpen" />
</template>

<style lang="scss" module>
.card {
  --button-block-height: 68px;

  &.createDisabled {
    --button-block-height: 0px;
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 12px;
  max-height: calc(var(--content-height) - var(--button-block-height));
}
</style>
