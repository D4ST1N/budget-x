<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const provider = computed(() => {
  if (!user.value) return null;

  const [firstProvider] = user.value.providers;

  return firstProvider;
});
</script>

<template>
  <div v-if="user" :class="$style.userInfo">
    <v-avatar color="grey-lighten-1">
      <v-img alt="avatar" :src="provider?.profile_picture_url"></v-img>
    </v-avatar>

    <div :class="$style.userName">
      {{ user.name.first_name }} {{ user.name.last_name }}
    </div>
  </div>
</template>

<style lang="scss" module>
.userInfo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.userName {
  max-width: 200px;
}
</style>
