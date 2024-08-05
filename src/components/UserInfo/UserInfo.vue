<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";

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
    <div :class="$style.userAvatarWrapper">
      <img
        :src="provider?.profile_picture_url"
        alt="avatar"
        :class="$style.userAvatar"
      />
    </div>

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

.userAvatarWrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(var(--v-theme-secondary));
}

.userAvatar {
  width: 100%;
}

.userName {
  max-width: 200px;
}
</style>
