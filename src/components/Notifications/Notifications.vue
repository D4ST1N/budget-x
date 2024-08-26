<script setup lang="ts">
import { useNotificationStore } from "@/store/notification";
import { Notification, NotificationType } from "@/types/Notification";
import { storeToRefs } from "pinia";

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

function getNotificationColor(notification: Notification) {
  if (notification.type === NotificationType.Success) return "success";
  if (notification.type === NotificationType.Warning) return "warning";
  if (notification.type === NotificationType.Error) return "error";

  return "info";
}
</script>

<template>
  <TransitionGroup name="notification" tag="div" :class="$style.container">
    <v-alert
      v-for="notification in notifications"
      :key="notification.id"
      :timeout="notification.timeout"
      :color="getNotificationColor(notification)"
      :model-value="true"
      position="static"
      transition="scale-transition"
      :class="$style.notification"
    >
      {{ notification.text }}
    </v-alert>
  </TransitionGroup>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  width: 100%;
  z-index: 2500;
  pointer-events: none;
}

.notification {
  pointer-events: all;
}

:global {
  .notification-move,
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    width: calc(100% - 40px) !important;
    transform: scaleY(0.01) translate(30px, 0);
  }

  .notification-leave-active {
    position: absolute;
  }
}
</style>
