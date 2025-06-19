import { EditTask, RegisterTask } from '../../models/task';
import { fetchDelete, fetchPatch, fetchPost } from '../fetcher/fetcher';
import apiEndpoints from './apiEndpoints';

export function addTaskPost(task: RegisterTask) {
  const response = fetchPost<RegisterTask>(apiEndpoints.tasks, task);
  return response;
}

export function editTaskPatch(taskId: number, task: EditTask) {
  const response = fetchPatch<EditTask>(
    `${apiEndpoints.tasks}/${taskId}`,
    task,
  );
  return response;
}

export function deleteTask(taskId: number) {
  const response = fetchDelete(`${apiEndpoints.tasks}/${taskId}`);
  return response;
}
