import { timeout as wait } from "@/helpers/utils";
import {
  Notification,
  NotificationData,
  NotificationType,
} from "@/types/Notification";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  function add({
    text = "",
    timeout = 4000,
    type = NotificationType.Success,
  }: NotificationData) {
    const id = uuidv4();

    notifications.value.push({
      text,
      timeout,
      type,
      id,
    });

    if (timeout > -1) {
      removeAfterTimeout(timeout, id);
    }

    return id;
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter(
      (notification) => notification.id !== id
    );
  }

  async function removeAfterTimeout(timeout: number, id: string) {
    await wait(timeout);

    remove(id);
  }

  return {
    notifications,
    add,
    remove,
  };
});
