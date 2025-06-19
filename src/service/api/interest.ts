import { Interest } from '../../models/skill';
import { fetchDelete, fetchPost } from '../fetcher/fetcher';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import apiEndpoints from './apiEndpoints';

export function useFetchBaseInterests() {
  const params = apiEndpoints.interests;
  return useFetchWithSWR<Interest[], Error>(params);
}

export function createVolunteerInterestPost(interestName: string) {
  const response = fetchPost<{ name: string }>(apiEndpoints.interests, {
    name: interestName,
  });
  return response;
}

export function deleteInterest(interestId: number) {
  const response = fetchDelete(`${apiEndpoints.interests}/${interestId}`);
  return response;
}
