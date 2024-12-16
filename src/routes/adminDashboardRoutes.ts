import * as React from 'react';
import { IRoute } from './types';

const CatManagement = React.lazy(
  () => import('@Views/AdminDashboard/CatManagement'),
);
const AlertLogs = React.lazy(() => import('@Views/AdminDashboard/AlertLogs'));
const UserManagement = React.lazy(
  () => import('@Views/AdminDashboard/UserManagement'),
);
const AnalyticsGraph = React.lazy(
  () => import('@Views/AdminDashboard/AnalyticsGraph'),
);
const LayerVisualization = React.lazy(
  () => import('@Views/AdminDashboard/LayerVisualization'),
);
const AlertThreshold = React.lazy(
  () => import('@Views/AdminDashboard/AlertThreshold'),
);
const LayerInfoManagement = React.lazy(
  () => import('@Views/AdminDashboard/LayerInfoManagement'),
);

const emailChannel = React.lazy(
  () => import('@Views/EmailChannel/EmailChannel'),
);

const adminDashboardRoutes: IRoute[] = [
  {
    path: '/category-management',
    component: CatManagement,
    name: 'Category Management',
    authenticated: true,
  },
  {
    path: '/layer-visualization',
    component: LayerVisualization,
    name: 'Layer Visualization',
    authenticated: true,
  },
  {
    path: '/alert-logs',
    component: AlertLogs,
    name: 'Alert logs',
    authenticated: true,
  },
  {
    path: '/alert-threshold',
    component: AlertThreshold,
    name: 'Alert Threshold',
    authenticated: true,
  },
  {
    path: '/analythics-graph',
    component: AnalyticsGraph,
    name: 'Analytics Graph',
    authenticated: true,
  },
  {
    path: '/user-management',
    component: UserManagement,
    name: 'User Management',
    authenticated: true,
  },
  {
    path: '/layer-info-management',
    component: LayerInfoManagement,
    name: 'Layer Info Management',
    authenticated: true,
  },
  {
    path: '/email-channel',
    component: emailChannel,
    name: 'Email Channel',
    authenticated: true,
  },
];

export default adminDashboardRoutes;
