export enum NotificationType {
  Info = "Info",
  Success = "Success",
  Warning = "Warning",
  Error = "Error",
}

export interface NotificationData {
  text: string;
  type: NotificationType;
  timeout?: number;
}

export interface Notification extends NotificationData {
  id: string;
}
