<script setup lang="ts"></script>

<template>
  <div :class="$style.container">
    <v-btn :to="{ name: 'ShareWallet' }" variant="text">
      <template #prepend>
        <v-icon>mdi-share-variant</v-icon>
      </template>
      {{ $t("wallet.share") }}
    </v-btn>
    <v-btn :to="{ name: 'EditWallet' }" variant="text">
      <template #prepend>
        <v-icon>mdi-cog</v-icon>
      </template>
      {{ $t("wallet.edit") }}
    </v-btn>
  </div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 12px;
}
</style>
