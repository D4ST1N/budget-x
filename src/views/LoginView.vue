<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

onMounted(() => {
  userStore.loginUser("#stytch-sdk");
});
</script>

<template>
  <div :class="$style.page">
    <h1>Login page</h1>
    <div id="stytch-sdk"></div>
  </div>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
</style>
