import i18n from "@/plugins/i18n";
import { useNotificationStore } from "@/store/notification";
import { NotificationType } from "@/types/Notification";
import { ServerResponseError } from "@/types/ServerResponse";
import axios from "axios";

export function handleServerError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const notificationStore = useNotificationStore();

    const serverError = error.response?.data as ServerResponseError;

    notificationStore.add({
      text: i18n.global.t(`errors.${serverError.errorType}`),
      type: NotificationType.Error,
    });
  } else {
    console.error((error as Error).message);
  }
}
