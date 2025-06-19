import { TaskPreview } from '../../models/task';
import {
  OneVolunteersInterests,
  OneVolunteersSkills,
  VolunteerLog,
  VolunteerProfileInfo,
} from '../../models/volunteer';
import { fetchDelete, fetchPost } from '../fetcher/fetcher';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import apiEndpoints from './apiEndpoints';

export function joinEventPost(eventId: number) {
  return fetchPost<unknown>(`${apiEndpoints.volunteers}/events/${eventId}`, {});
}

export function resingEventDelete(eventId: number) {
  return fetchDelete(`${apiEndpoints.volunteers}/events/${eventId}`);
}

export function applyEventTaskPost(eventId: number, taskId: number) {
  return fetchPost<unknown>(
    `${apiEndpoints.volunteers}/events/${eventId}/tasks/${taskId}`,
    {},
  );
}

export function resignEventTaskDelete(eventId: number, taskId: number) {
  return fetchDelete(
    `${apiEndpoints.volunteers}/events/${eventId}/tasks/${taskId}`,
  );
}

export function resetVolunteerSkillsPost(volunteerSkills: OneVolunteersSkills) {
  const response = fetchPost<OneVolunteersSkills>(
    `${apiEndpoints.volunteers}/skills/reset`,
    volunteerSkills,
  );
  return response;
}

export function resetVolunteerInterestsPost(
  volunteerInterests: OneVolunteersInterests,
) {
  const response = fetchPost<OneVolunteersInterests>(
    `${apiEndpoints.volunteers}/interests/reset`,
    volunteerInterests,
  );
  return response;
}

export function useFetchVolunteerProfileInfo(volunteerId: number) {
  const params = `${apiEndpoints.profiles}/${volunteerId}`;
  return useFetchWithSWR<VolunteerProfileInfo, Error>(params);
}

export function useFetchEventTasksForVolunteer(
  volunteerId: number,
  eventId: number,
) {
  const params = `${apiEndpoints.volunteers}/${volunteerId}/events/${eventId}/tasks`;
  return useFetchWithSWR<TaskPreview[], Error>(params);
}

export function createVolunteerLogPost(volunteerLog: VolunteerLog) {
  const response = fetchPost<unknown>(apiEndpoints.logs, volunteerLog);
  return response;
}
