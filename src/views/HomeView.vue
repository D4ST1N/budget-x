<script setup lang="ts">
console.log(import.meta.env);
console.log(import.meta.env.VITE_SERVER_URL);
fetch(import.meta.env.VITE_SERVER_URL);
</script>

<template>
  <v-btn>Add Expense</v-btn>
</template>
