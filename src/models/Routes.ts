import { FC } from 'react';
import Home from '../pages/Home';
import Events from '../pages/Events';
import Organizations from '../pages/Organizations';
import Login from '../pages/Login';

interface Route {
  key: string;
  title: string;
  path: string;
  enabled: boolean;
  component: FC;
}

const NavRoutes: Route[] = [
  {
    key: 'home-route',
    title: 'Home',
    path: '/',
    enabled: true,
    component: Home,
  },
  {
    key: 'events-route',
    title: 'Events',
    path: '/events',
    enabled: true,
    component: Events,
  },
  {
    key: 'organizations-route',
    title: 'Organizations',
    path: '/organizations',
    enabled: true,
    component: Organizations,
  },
  {
    key: 'login-route',
    title: 'Log in',
    path: '/login',
    enabled: true,
    component: Login,
  },
];

export default NavRoutes;
