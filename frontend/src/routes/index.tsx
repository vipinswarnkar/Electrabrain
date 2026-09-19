import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage').then((m) => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);

const PagePlaceholder = lazy(() =>
  import('@/pages/PagePlaceholder').then((m) => ({ default: m.PagePlaceholder })),
);
const BatteriesPage = lazy(() => import('@/pages/battery/BatteriesPage').then((m) => ({ default: m.BatteriesPage })));
const BatteryDetailPage = lazy(() =>
  import('@/pages/battery/BatteryDetailPage').then((m) => ({ default: m.BatteryDetailPage })),
);
const MonitoringPage = lazy(() => import('@/pages/battery/MonitoringPage').then((m) => ({ default: m.MonitoringPage })));
const AlertsPage = lazy(() => import('@/pages/battery/AlertsPage').then((m) => ({ default: m.AlertsPage })));
const PredictionsPage = lazy(() => import('@/pages/predictions/PredictionsPage').then((m) => ({ default: m.PredictionsPage })));
const PredictionDetailPage = lazy(() => import('@/pages/predictions/PredictionDetailPage').then((m) => ({ default: m.PredictionDetailPage })));
const HealthAnalysisPage = lazy(() => import('@/pages/analytics/HealthAnalysisPage').then((m) => ({ default: m.HealthAnalysisPage })));
const DegradationTrendsPage = lazy(() => import('@/pages/analytics/DegradationTrendsPage').then((m) => ({ default: m.DegradationTrendsPage })));
const CycleAnalysisPage = lazy(() => import('@/pages/analytics/CycleAnalysisPage').then((m) => ({ default: m.CycleAnalysisPage })));
const AhrfModelPage = lazy(() => import('@/pages/models/AhrfModelPage').then((m) => ({ default: m.AhrfModelPage })));
const ExplainabilityPage = lazy(() => import('@/pages/ai/ExplainabilityPage').then((m) => ({ default: m.ExplainabilityPage })));
const OptimizationPage = lazy(() => import('@/pages/ai/OptimizationPage').then((m) => ({ default: m.OptimizationPage })));
const ModelComparisonPage = lazy(() => import('@/pages/ai/ModelComparisonPage').then((m) => ({ default: m.ModelComparisonPage })));
const DatasetsPage = lazy(() => import('@/pages/datasets/DatasetsPage').then((m) => ({ default: m.DatasetsPage })));
const DatasetDetailPage = lazy(() => import('@/pages/datasets/DatasetDetailPage').then((m) => ({ default: m.DatasetDetailPage })));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.default })));

function placeholder(
  title: string,
  subtitle?: string,
  breadcrumbs?: { label: string; path?: string }[],
) {
  return <PagePlaceholder title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />;
}

export const routes: RouteObject[] = [
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: '/login', element: <LoginPage /> },
              { path: '/signup', element: <SignupPage /> },
              { path: '/forgot-password', element: <ForgotPasswordPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            errorElement: <RouteErrorPage />,
            children: [
              { index: true, element: <Navigate to="/dashboard" replace /> },
              {
                path: 'dashboard',
                element: <DashboardPage />,
              },
              {
                path: 'monitoring',
                element: <MonitoringPage />,
              },
              {
                path: 'batteries',
                element: <BatteriesPage />,
              },
              {
                path: 'batteries/:batteryId',
                element: <BatteryDetailPage />,
              },
              {
                path: 'alerts',
                element: <AlertsPage />,
              },
              {
                path: 'analytics/health',
                element: <HealthAnalysisPage />,
              },
              {
                path: 'analytics/degradation',
                element: <DegradationTrendsPage />,
              },
              {
                path: 'analytics/cycles',
                element: <CycleAnalysisPage />,
              },
              {
                path: 'predictions',
                element: <PredictionsPage />,
              },
              {
                path: 'predictions/:batteryId',
                element: <PredictionDetailPage />,
              },
              {
                path: 'models/ahrf',
                element: <AhrfModelPage />,
              },
              {
                path: 'ai/explainability',
                element: <ExplainabilityPage />,
              },
              {
                path: 'ai/model-comparison',
                element: <ModelComparisonPage />,
              },
              {
                path: 'ai/optimization',
                element: <OptimizationPage />,
              },
              {
                path: 'ai/experiments',
                element: placeholder(
                  'Experiments',
                  'Experiment tracking for datasets, feature sets, and model configurations.',
                ),
              },
              {
                path: 'datasets',
                element: <DatasetsPage />,
              },
              {
                path: 'datasets/:datasetId',
                element: <DatasetDetailPage />,
              },
              {
                path: 'reports',
                element: placeholder('Reports', 'Health, SOC, SOH, RUL, SHAP, and maintenance reports.'),
              },
              {
                path: 'exports',
                element: placeholder('Exports', 'CSV, Excel, PDF, and JSON export jobs.'),
              },
              {
                path: 'maintenance',
                element: placeholder(
                  'Maintenance Recommendations',
                  'Rule-based decision support with configurable thresholds.',
                ),
              },
              {
                path: 'maintenance/history',
                element: placeholder(
                  'Maintenance History',
                  'Past maintenance actions and recommendation outcomes.',
                  [{ label: 'Maintenance', path: '/maintenance' }, { label: 'History' }],
                ),
              },
              {
                path: 'settings',
                element: placeholder('Settings', 'Application and system configuration.'),
              },
              {
                path: 'settings/profile',
                element: placeholder(
                  'Profile Settings',
                  'User profile and account preferences.',
                  [{ label: 'Settings', path: '/settings' }, { label: 'Profile' }],
                ),
              },
              {
                path: 'settings/notifications',
                element: placeholder(
                  'Notification Settings',
                  'Alert and notification preferences.',
                  [{ label: 'Settings', path: '/settings' }, { label: 'Notifications' }],
                ),
              },
              {
                path: 'settings/system',
                element: placeholder(
                  'System Settings',
                  'Threshold configuration and integration settings.',
                  [{ label: 'Settings', path: '/settings' }, { label: 'System' }],
                ),
              },
              {
                path: 'help',
                element: placeholder('Help & Support', 'Documentation and support resources.'),
              },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
];
