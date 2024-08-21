<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import AddTagDialog from "./AddTagDialog.vue";
import Tag from "./Tag.vue";

const { t } = useI18n();
const walletStore = useWalletStore();

const { tags } = storeToRefs(walletStore);
const isAddTagDialogOpen = ref<boolean>(false);

function openAddTagDialog() {
  isAddTagDialogOpen.value = true;
}
</script>

<template>
  <v-card>
    <v-card-text>
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
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 12px;
  max-height: calc(100vh - var(--v-layout-top) - 32px - 68px);
}
</style>
