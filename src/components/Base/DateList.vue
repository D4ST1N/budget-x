<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { VList } from "vuetify/components";

type DateListProps = {
  items: { name: string; value: number }[];
  active: number;
};

const emit = defineEmits(["select:item"]);
const props = defineProps<DateListProps>();

const listRef = ref<typeof VList | null>(null);

onMounted(scrollToActiveItem);

function selectItem(value: number) {
  emit("select:item", value);
}

function scrollToActiveItem() {
  nextTick(() => {
    const activeItem = listRef.value?.$el?.querySelector(
      ".v-list-item--active"
    );
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: "auto", block: "center" });
    }
  });
}
</script>

<template>
  <v-list ref="listRef" selectable mandatory :class="$style.list">
    <v-list-item
      v-for="item in props.items"
      :key="item.name"
      :value="item.value"
      v-ripple
      :active="props.active === item.value"
      rounded
      :class="$style.item"
      @click="selectItem(item.value)"
    >
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style lang="scss" module>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px;
}

.item {
  width: 33%;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: center;

  &:global(.v-list-item--active) {
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }
}
</style>
