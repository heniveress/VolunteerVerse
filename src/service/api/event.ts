import queryString from 'query-string';
import {
  EventDetails,
  EventFilterParams,
  EventMembersByTasks,
  EventMembersByVolunteers,
  EventPreview,
  RegisterEvent,
} from '../../models/event';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import apiEndpoints from './apiEndpoints';
import {
  fetchDelete,
  fetchFormDataPost,
  fetchPatch,
  fetchPost,
} from '../fetcher/fetcher';

export function useFetchEvents(eventFilters: EventFilterParams) {
  const params = queryString.stringify(eventFilters);
  const url = `${apiEndpoints.events}?${params}`;
  return useFetchWithSWR<EventPreview[], Error>(url);
}

export function registerEventPost(registerEvent: RegisterEvent) {
  const formData = new FormData();

  Object.entries(registerEvent).forEach((entry) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [key, value] = entry;
    //   eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Array.isArray(value)) {
      value.forEach((element) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.append(key, JSON.stringify(element));
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      formData.append(key, value);
    }
  });
  return fetchFormDataPost(formData, apiEndpoints.events);
}

export function useFetchEventPreview(eventId: number) {
  const params = `${apiEndpoints.events}/${eventId}`;
  return useFetchWithSWR<EventPreview, Error>(params);
}

export function useFetchEventDetails(eventId: number) {
  const params = `${apiEndpoints.events}/${eventId}/details`;
  return useFetchWithSWR<EventDetails, Error>(params);
}

export function useFetchEventMembersByVolunteers(eventId: number) {
  const params = `${apiEndpoints.events}/${eventId}/members`;
  return useFetchWithSWR<EventMembersByVolunteers[], Error>(params);
}

export function useFetchEventMembersByTasks(eventId: number) {
  const params = `${apiEndpoints.events}/${eventId}/tasks`;
  return useFetchWithSWR<EventMembersByTasks[], Error>(params);
}

export function useFetchTaskRegistrations(eventId: number) {
  const params = `${apiEndpoints.events}/${eventId}/registrations`;
  return useFetchWithSWR<EventMembersByTasks[], Error>(params);
}

export function editEventPatch(eventId: number, event: EventDetails) {
  const response = fetchPatch<EventDetails>(
    `${apiEndpoints.events}/${eventId}`,
    event,
  );
  return response;
}

export function deleteEvent(eventId: number) {
  const response = fetchDelete(`${apiEndpoints.events}/${eventId}`);
  return response;
}

export function acceptTaskRegistrationPost(
  eventId: number,
  registrationId: number,
) {
  return fetchPost<unknown>(
    `${apiEndpoints.events}/${eventId}/registrations/${registrationId}`,
    {},
  );
}

export function declineTaskRegistrationkDelete(
  eventId: number,
  registrationId: number,
) {
  return fetchDelete(
    `${apiEndpoints.events}/${eventId}/registrations/${registrationId}`,
  );
}
