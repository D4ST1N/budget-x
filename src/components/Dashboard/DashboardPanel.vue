<script setup lang="ts"></script>

<template>
  <div :class="$style.panel">
    <slot />
  </div>
</template>

<style lang="scss" module>
.panel {
  background-color: rgba(var(--v-theme-primary), 0.06);
  border-radius: 6px;
}
</style>
