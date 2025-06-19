import { Skill } from '../../models/skill';
import { fetchDelete, fetchPost } from '../fetcher/fetcher';
import useFetchWithSWR from '../fetcher/useFetchWithSwr';
import apiEndpoints from './apiEndpoints';

export function useFetchBaseSkills() {
  const params = apiEndpoints.skills;
  return useFetchWithSWR<Skill[], Error>(params);
}

export function createVolunteerSkillPost(skillName: string) {
  const response = fetchPost<{ name: string }>(apiEndpoints.skills, {
    name: skillName,
  });
  return response;
}

export function deleteSkill(skillId: number) {
  const response = fetchDelete(`${apiEndpoints.skills}/${skillId}`);
  return response;
}
