<script setup lang="ts">
import { computed } from "vue";

type RadioGroupProps = {
  selectedValue: string;
  items: { name: string; value: string }[];
  label: string;
  size?: "x-small" | "small" | "default" | "large" | "x-large" | number;
  density?: "default" | "comfortable" | "compact" | null;
};

const emit = defineEmits(["update:selectedValue"]);
const props = withDefaults(defineProps<RadioGroupProps>(), {
  size: "x-small",
  density: "compact",
});

const selected = computed({
  get: () => props.selectedValue,
  set: (value) => emit("update:selectedValue", value),
});
</script>

<template>
  <div :class="$style.wrapper">
    <div class="text-primary" :class="$style.label">
      {{ props.label }}
    </div>

    <v-btn-toggle
      v-model="selected"
      mandatory
      :density="props.density"
      selected-class="bg-primary"
    >
      <v-btn
        v-for="item in props.items"
        :key="item.value"
        :size="props.size"
        :value="item.value"
      >
        {{ item.name }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  display: flex;
  justify-content: flex-start;
  font-size: 12px;
}
</style>
