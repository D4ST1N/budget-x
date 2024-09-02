import i18n from "@/plugins/i18n";
import router from "@/router/router";
import { useNotificationStore } from "@/store/notification";
import { ErrorType } from "@/types/ErrorType";
import { NotificationType } from "@/types/Notification";
import { ServerResponseError } from "@/types/ServerResponse";
import axios from "axios";

export class CustomError extends Error {
  errorType: ErrorType;

  constructor(message: string, errorType: ErrorType) {
    super(message);
    this.name = "CustomError";
    this.errorType = errorType;
  }
}

export function handleServerError(
  error: unknown,
  handledErrorTypes?: ErrorType[]
) {
  if (axios.isAxiosError(error)) {
    const notificationStore = useNotificationStore();

    if (error.response?.status === 401) {
      console.log(router, router.currentRoute.value.name);

      if (router.currentRoute.value.name !== "Login") {
        return router.push({ name: "Login" });
      } else {
        return;
      }
    }

    const serverError = error.response?.data as ServerResponseError;

    if (
      handledErrorTypes &&
      handledErrorTypes.includes(serverError.errorType)
    ) {
      console.log(serverError.errorType);
      throw new CustomError("Custom Error", serverError.errorType);
    }

    notificationStore.add({
      text: i18n.global.t(`errors.${serverError.errorType}`),
      type: NotificationType.Error,
    });
  } else {
    console.error((error as Error).message);
  }
}

export function CustomErrorGuard(
  error: unknown,
  errorType: ErrorType,
  callback: () => void
) {
  if (error instanceof CustomError && error.errorType === errorType) {
    callback();
  } else {
    console.error((error as Error).message);
  }
}
