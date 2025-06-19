import { NotificationMessage } from '../../models/notification';
import { fetchDelete, fetchPatch, fetchPost } from '../fetcher/fetcher';
import apiEndpoints from './apiEndpoints';

export function sendNotificationMessagePost(
  notificationMessage: NotificationMessage,
) {
  const response = fetchPost<NotificationMessage>(
    `${apiEndpoints.notifications}/volunteers`,
    notificationMessage,
  );
  return response;
}

export function changeAllNotificationToSeenPatch() {
  const response = fetchPatch<unknown>(apiEndpoints.notifications, null);
  return response;
}

export function changeOneNotificationToSeenPatch(
  volunteerNotificationId: number,
) {
  const response = fetchPatch<unknown>(
    `${apiEndpoints.notifications}/${volunteerNotificationId}`,
    null,
  );
  return response;
}

export function deleteVolunteerNotification(volunteerNotificationId: number) {
  return fetchDelete(
    `${apiEndpoints.notifications}/volunteers/${volunteerNotificationId}`,
  );
}
