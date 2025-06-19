import apiEndpoints from './apiEndpoints';
import { fetchPatch } from '../fetcher/fetcher';
import { AccountInfo, Password } from '../../models/accountInfo';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import { Image } from '../../models/image';
import { ProfileEvent } from '../../models/event';
import { Notification, NumberOfNotifications } from '../../models/notification';

export function useFetchProfile() {
  const params = `${apiEndpoints.profiles}/own`;
  return useFetchWithSWR<AccountInfo, Error>(params);
}

export function useFetchProfileImage() {
  return useFetchWithSWR<Image, Error>(`${apiEndpoints.profiles}/picture`);
}

export function useFetchProfileEvents() {
  return useFetchWithSWR<ProfileEvent[], Error>(
    `${apiEndpoints.profiles}/events`,
  );
}

export async function editProfilePatch(
  accountId: number,
  accountInfo: AccountInfo,
) {
  const response = fetchPatch<AccountInfo>(
    `${apiEndpoints.profiles}/${accountId}`,
    accountInfo,
  );
  return response;
}

export async function changePasswordPatch(password: Password) {
  const response = fetchPatch<Password>(apiEndpoints.changePassword, password);
  return response;
}

export function useFetchAllNotifications() {
  const params = apiEndpoints.profileNotification;
  return useFetchWithSWR<Notification[], Error>(params);
}

export function useFetchUnseenNotifications() {
  const params = `${apiEndpoints.profileNotification}/unseen`;
  return useFetchWithSWR<Notification[], Error>(params);
}

export function useFetchNumberOfNewNotifications() {
  const params = `${apiEndpoints.profileNotification}/unseen/count`;
  return useFetchWithSWR<NumberOfNotifications, Error>(params);
}
