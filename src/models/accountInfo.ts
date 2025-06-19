import { Interest, Skill } from './skill';

export interface AccountInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePictureUri?: string;
  coverImageUri?: string;
  hasPassword: boolean;
  volunteer?: {
    id: number;
    interests?: Interest[];
    skills?: Skill[];
  };
}

export interface Password {
  oldPassword?: string;
  newPassword: string;
}
