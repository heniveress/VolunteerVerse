import { Credentials } from '../../models/credentials';
import apiEndpoints from './apiEndpoints';
import { fetchPost } from '../fetcher/fetcher';

export async function loginPost(credentials: Credentials) {
  const response = fetchPost<Credentials>(apiEndpoints.login, credentials);
  return response;
}

export async function googleLoginPost(token: string) {
  const response = fetchPost<{ credential: string }>(apiEndpoints.googleLogin, {
    credential: token,
  });
  return response;
}
