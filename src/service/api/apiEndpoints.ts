import { baseURL } from '../../utils/config';

const apiEndpoints = {
  login: `${baseURL}accounts/login`,
  googleLogin: `${baseURL}accounts/google-auth`,
  profiles: `${baseURL}profiles`,
  profileNotification: `${baseURL}profiles/notifications`,
  changePassword: `${baseURL}accounts/change-password`,
  register: `${baseURL}accounts/register`,
  organizations: `${baseURL}organizations`,
  events: `${baseURL}events`,
  skills: `${baseURL}skills`,
  interests: `${baseURL}interests`,
  tasks: `${baseURL}tasks`,
  volunteers: `${baseURL}volunteers`,
  notifications: `${baseURL}notifications`,
  reviews: `${baseURL}reviews`,
  logs: `${baseURL}logs`,
};

export default apiEndpoints;
