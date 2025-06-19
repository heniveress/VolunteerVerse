// eslint-disable-next-line import/no-cycle
import { OrganizationPreview } from './organization';
import { RegisterTask, Task, TaskPreview } from './task';
import { VolunteerInfo } from './volunteer';

export interface EventPreview {
  id: number;
  name: string;
  organization: OrganizationPreview;
  description: string;
  location: string;
  startTime: Date;
  imageUri: string;
  hasEnded: boolean;
}

export interface EventFilterParams {
  name: string;
  organizationName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  skills: number[];
}

export interface RegisterEvent {
  organizationId: number;
  name: string;
  location: string;
  phone: string;
  manpower: number;
  startTime?: Date;
  endTime?: Date;
  description: string;
  imageFile?: File;
  taskModelRequests?: RegisterTask[];
}

export interface EventDetails {
  id: number;
  name: string;
  organization: OrganizationPreview;
  isOrganizer: boolean;
  roleInEvent: number;
  isJoined: boolean;
  phone: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  manpower: number;
  applied: number;
  imageUri: string;
  hasEnded: boolean;
  tasks: Task[];
}

export interface ProfileEvent {
  id: number;
  name: string;
  organization: OrganizationPreview;
  startTime: Date;
  endTime: Date;
  imageUri: string;
  hasEnded: boolean;
  tasks: TaskPreview[];
}

export interface EventMembersByVolunteers {
  volunteer: VolunteerInfo;
  tasks: TaskPreview[];
}

export interface EventMembersByTasks {
  task: TaskPreview;
  volunteers: VolunteerInfo[];
}
