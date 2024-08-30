<template>
  <div :class="$style.actions">
    <slot />
  </div>
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
