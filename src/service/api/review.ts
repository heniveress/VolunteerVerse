import {
  CreateReview,
  EventReviewForOrg,
  VolunteerReviewFromEvent,
} from '../../models/review';
import { fetchPost } from '../fetcher/fetcher';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import apiEndpoints from './apiEndpoints';

export function createVolunteerReviewPost(review: CreateReview) {
  const response = fetchPost<unknown>(
    `${apiEndpoints.reviews}/volunteers`,
    review,
  );
  return response;
}

export function createEventReviewPost(eventId: number, review: CreateReview) {
  const response = fetchPost<unknown>(
    `${apiEndpoints.reviews}/events/${eventId}`,
    review,
  );
  return response;
}

export function useFetchVolunteerRating(volunteerId: number) {
  return useFetchWithSWR<{ rating?: number }, Error>(
    `${apiEndpoints.reviews}/volunteers/${volunteerId}/rating`,
  );
}

export function useFetchOrganizationReviews(orgId: number) {
  return useFetchWithSWR<EventReviewForOrg[], Error>(
    `${apiEndpoints.reviews}/organizations/${orgId}`,
  );
}

export function useFetchOrganizationRating(orgId: number) {
  return useFetchWithSWR<{ rating?: number }, Error>(
    `${apiEndpoints.reviews}/organizations/${orgId}/rating`,
  );
}

export function useFetchVolunteerReviews(volunteerId: number) {
  return useFetchWithSWR<VolunteerReviewFromEvent[], Error>(
    `${apiEndpoints.reviews}/volunteers/${volunteerId}`,
  );
}
