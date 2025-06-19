// eslint-disable-next-line import/no-cycle
import { EventPreview } from './event';

export interface OrganizationPreview {
  id: number;
  name: string;
  imageUri: string;
}

export interface RegisterOrganization {
  name: string;
  description: string;
  availability: string;
  emails: string[];
}

export interface OrganizationMember {
  volunteerId: number;
  role: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
}

export interface DetailedOrganization {
  id: number;
  name: string;
  description: string;
  availability: string;
  imageUri: string;
  rating: number;
  roleInOrganization: number;
  events: EventPreview[];
  members: OrganizationMember[];
}

export interface OrganizationMemberEmail {
  email: string;
}
