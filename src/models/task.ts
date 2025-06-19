import { Skill } from './skill';

export interface RegisterTask {
  eventId: number;
  name: string;
  description: string;
  capacity: number;
  needApproval: boolean;
  requiredSkills: number[];
}

export interface Task {
  id: number;
  name: string;
  description: string;
  capacity: number;
  taken: number;
  isApplied: boolean;
  isApproved: boolean;
  needApproval: boolean;
  skills: Skill[];
}

export interface TaskPreview {
  id: number;
  name: string;
}

export interface TaskUpdate {
  name: string;
  description: string;
  capacity: number;
  needApproval: boolean;
}

export interface EditTask {
  taskUpdate: TaskUpdate;
  requiredSkillIds: number[];
}
