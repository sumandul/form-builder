import React from 'react';
import { IRoute } from './types';

// Lazy loading
//*  Please consider to rethink before implementing lazy loading
// const HomePage = React.lazy(() => import('@Pages/HomePage'));
// const DashboardPage = React.lazy(() => import('@Pages/DashboardPage'));
const Dashboard = React.lazy(() => import('@Views/Dashboard'));
const AboutPage = React.lazy(() => import('@Views/AboutPage'));
const LoginPage = React.lazy(() => import('@Views/Login'));
const ResetPasswordPage = React.lazy(() => import('@Views/ResetPassword'));
const PDF = React.lazy(() => import('@Views/PDF'));
const AdminDashboard = React.lazy(() => import('@Views/AdminDashboard'));
const Analytics = React.lazy(() => import('@Views/Analytics'));

const appRoutes: IRoute[] = [
  {
    path: '/',
    name: 'Dashboard ',
    component: Dashboard,
    authenticated: true,
  },
  {
    path: '/signin',
    name: 'Signin ',
    component: LoginPage,
    authenticated: false,
  },
  {
    path: '/resetpassword',
    name: 'Reset Password ',
    component: ResetPasswordPage,
    authenticated: false,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    authenticated: true,
  },
  {
    path: '/pdf',
    name: 'PDF',
    component: PDF,
    authenticated: true,
  },
  {
    path: '/admin-dashboard/*',
    name: 'Admin Dashboard ',
    component: AdminDashboard,
    authenticated: true,
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    authenticated: false,
  },
];

export default appRoutes;
