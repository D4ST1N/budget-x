<script setup lang="ts">
import { useWalletStore } from "@/store/wallet";
import { ExpenseEditData } from "@/types/Expense";
import { useI18n } from "vue-i18n";

type ExpensePartProps = {
  part: ExpenseEditData;
  main?: boolean;
};

const props = withDefaults(defineProps<ExpensePartProps>(), {
  main: false,
});
const { t, n } = useI18n();
const walletStore = useWalletStore();
</script>

<template>
  <v-list-item
    variant="elevated"
    base-color="secondary"
    rounded
    v-ripple
    :class="$style.item"
  >
    <div v-if="props.main" class="bg-primary" :class="$style.mainLabel">
      {{ t("expense.remainder") }}
    </div>

    <v-list-item-title>
      {{ n(props.part.amount, "currency") }}
    </v-list-item-title>

    <v-list-item-subtitle v-if="props.part.categoryId">
      {{ walletStore.categoryById(props.part.categoryId)?.name }}
    </v-list-item-subtitle>

    <div>
      <v-chip
        v-for="tag in props.part.tagNames"
        :key="tag"
        density="comfortable"
        size="x-small"
        variant="outlined"
      >
        {{ tag }}
      </v-chip>
    </div>
  </v-list-item>
</template>

<style lang="scss" module>
.item {
  position: relative;
  overflow: hidden;

  &:has(.mainLabel) {
    padding-top: 24px;
  }
}

.mainLabel {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  padding: 4px 16px;
  line-height: 12px;
  font-size: 12px;
}
</style>
