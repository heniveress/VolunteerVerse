import { RegisterUser } from '../../models/registerUser';
import { fetchPost } from '../fetcher/fetcher';
import apiEndpoints from './apiEndpoints';

export async function registerFetch(registerUser: RegisterUser) {
  const response = fetchPost<RegisterUser>(apiEndpoints.register, registerUser);
  return response;
}
export default registerFetch;
