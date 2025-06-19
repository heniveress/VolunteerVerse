export interface Notification {
  id: number;
  message: string;
  isSeen: boolean;
  notificationTime: Date;
}

export interface NumberOfNotifications {
  count: number;
}

export interface NotificationMessage {
  volunteerId: number;
  message: string;
}
