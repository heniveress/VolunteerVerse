import {
  RegisterOrganization,
  OrganizationPreview,
  DetailedOrganization,
  OrganizationMemberEmail,
} from '../../models/organization';
import { fetchPost, fetchPatch, fetchDelete } from '../fetcher/fetcher';
import apiEndpoints from './apiEndpoints';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import { VolunteerInfoForReview } from '../../models/volunteer';

export async function registerOrganizationPost(
  registerOrganization: RegisterOrganization,
) {
  const response = fetchPost<RegisterOrganization>(
    apiEndpoints.organizations,
    registerOrganization,
  );
  return response;
}

export function useFetchOrganizations() {
  const params = apiEndpoints.organizations;
  return useFetchWithSWR<OrganizationPreview[], Error>(params);
}

export function useFetchOrganizationById(orgId: number) {
  const params = `${apiEndpoints.organizations}/${orgId}`;
  return useFetchWithSWR<DetailedOrganization, Error>(params);
}

export function editOrganizationPatch(
  orgId: number,
  organization: DetailedOrganization,
) {
  const response = fetchPatch<DetailedOrganization>(
    `${apiEndpoints.organizations}/${orgId}`,
    organization,
  );
  return response;
}

export async function organizationMemberPost(
  orgId: number,
  email: OrganizationMemberEmail,
) {
  const response = fetchPost<OrganizationMemberEmail>(
    `${apiEndpoints.organizations}/${orgId}/account`,
    email,
  );
  return response;
}

export async function organizationDelete(orgId: number) {
  const response = fetchDelete(`${apiEndpoints.organizations}/${orgId}`);
  return response;
}

export async function leaveOrganizationDelete(orgId: number) {
  const response = fetchDelete(
    `${apiEndpoints.organizations}/${orgId}/account`,
  );
  return response;
}

export function useFetchPendingReviewees(orgId: number, eventId: number) {
  const params = `${apiEndpoints.organizations}/${orgId}/events/${eventId}/pending-reviews`;
  return useFetchWithSWR<VolunteerInfoForReview[], Error>(params);
}

export function changeOrgRolePatch(
  orgId: number,
  volunteerId: number,
  roleId: number,
) {
  const response = fetchPatch<unknown>(
    `${apiEndpoints.organizations}/${orgId}/volunteer/${volunteerId}/role/${roleId}`,
    null,
  );
  return response;
}

export async function removeVolunteerFromOrgDelete(
  orgId: number,
  volunteerId: number,
) {
  const response = fetchDelete(
    `${apiEndpoints.organizations}/${orgId}/volunteer/${volunteerId}`,
  );
  return response;
}
