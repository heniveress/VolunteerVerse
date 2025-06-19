import apiEndpoints from '../service/api/apiEndpoints';

export function getProfileImageUploadEndpoint(id: number): string {
  return `${apiEndpoints.profiles}/${id}/picture`;
}

export function getOrganizationImageUploadEndpoint(id: number): string {
  return `${apiEndpoints.organizations}/${id}/image`;
}

export function getEventImageUploadEndpoint(id: number): string {
  return `${apiEndpoints.events}/${id}/image`;
}

export function getVolunteerLogFileDownloadEndpoint(): string {
  return `${apiEndpoints.profiles}/volunteerlog/file/history`;
}
