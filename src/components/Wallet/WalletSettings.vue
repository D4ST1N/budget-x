<script setup lang="ts">
import { hasAccess } from "@/helpers/utils";
import { useWalletStore } from "@/store/wallets";
import { AccessLevel } from "@/types/AccessLevel";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import DeleteWalletDialog from "./DeleteWalletDialog.vue";
import EditWalletDialog from "./EditWalletDialog.vue";

const router = useRouter();

const i18n = useI18n();
const { t } = i18n;

const walletStore = useWalletStore();
const { currentAccessLevel } = storeToRefs(walletStore);

const isWalletEditDialogOpen = ref<boolean>(false);
const isWalletDeleteDialogOpen = ref<boolean>(false);

const items = computed(() => [
  {
    title: t("wallet.changeName"),
    icon: "mdi-rename",
    hasAccess: hasAccess([AccessLevel.Edit], currentAccessLevel.value),
    color: "primary",
    onSelect: () => {
      isWalletEditDialogOpen.value = true;
    },
  },
  {
    title: t("category.editCategories"),
    icon: "mdi-file-edit",
    hasAccess: hasAccess([AccessLevel.AddCategories], currentAccessLevel.value),
    color: "primary",
    onSelect: () => {
      router.push({ name: "Categories" });
    },
  },
  {
    title: t("wallet.share"),
    icon: "mdi-share-variant",
    hasAccess: hasAccess([AccessLevel.ShareWallet], currentAccessLevel.value),
    color: "primary",
    onSelect: () => {
      router.push({ name: "ShareWallet" });
    },
  },
  {
    title: t("wallet.deleteWallet"),
    icon: "mdi-delete",
    hasAccess: hasAccess([AccessLevel.Delete], currentAccessLevel.value),
    color: "error",
    onSelect: () => {
      isWalletDeleteDialogOpen.value = true;
    },
  },
]);

const availableItems = computed(() =>
  items.value.filter((item) => item.hasAccess)
);
</script>

<template>
  <div v-if="availableItems.length" :class="$style.container">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="text">
          <template #prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          {{ $t("wallet.edit") }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in availableItems"
          :key="i"
          @click="item.onSelect()"
        >
          <template #prepend>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </template>

          <v-list-item-title :class="item.color ? `text-${item.color}` : ''">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <EditWalletDialog v-model:isOpen="isWalletEditDialogOpen" />
    <DeleteWalletDialog v-model:isOpen="isWalletDeleteDialogOpen" />
  </div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
