import { Interest, Skill } from './skill';

export interface VolunteerInfo {
  accountId: number;
  volunteerId: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  registrationTime: Date;
  registrationId?: number;
}

export interface OneVolunteersSkills {
  volunteerId?: number;
  skillIds: number[];
}

export interface OneVolunteersInterests {
  volunteerId?: number;
  interestIds: number[];
}

export interface VolunteerProfileInfo {
  account: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture?: string;
  };
  volunteer: {
    id: number;
    interests?: Interest[];
    skills?: Skill[];
  };
}

export interface VolunteerInfoForReview {
  volunteerId: number;
  firstName: string;
  lastName: string;
  profilePictureUri?: string;
}

export interface VolunteerTask {
  taskId: number;
  hours: number | null;
}

export interface VolunteerLog {
  volunteerId: number;
  eventId: number;
  hours: number | null;
  volunteerTasks: VolunteerTask[];
}
