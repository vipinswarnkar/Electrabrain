import type { NavSection } from '@/types';

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'monitor',
    title: 'Monitor',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { id: 'monitoring', label: 'Live Monitoring', path: '/monitoring', icon: 'Activity' },
      { id: 'batteries', label: 'Batteries', path: '/batteries', icon: 'Battery' },
      { id: 'alerts', label: 'Alerts', path: '/alerts', icon: 'Bell' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      { id: 'health', label: 'Health Analysis', path: '/analytics/health', icon: 'HeartPulse' },
      { id: 'degradation', label: 'Degradation Trends', path: '/analytics/degradation', icon: 'TrendingDown' },
      { id: 'cycles', label: 'Cycle Analysis', path: '/analytics/cycles', icon: 'RefreshCw' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Predictions',
    items: [
      { id: 'predictions', label: 'Predictions', path: '/predictions', icon: 'Brain' },
      { id: 'live-demo', label: 'Live Demo', path: '/predictions/live-demo', icon: 'Zap' },
      { id: 'ahrf', label: 'AHRF Model', path: '/models/ahrf', icon: 'GitBranch' },
      { id: 'explainability', label: 'Explainable AI', path: '/ai/explainability', icon: 'Sparkles' },
      { id: 'comparison', label: 'Model Comparison', path: '/ai/model-comparison', icon: 'BarChart3' },
      { id: 'optimization', label: 'Optimization', path: '/ai/optimization', icon: 'SlidersHorizontal' },
      { id: 'experiments', label: 'Experiments', path: '/ai/experiments', icon: 'FlaskConical' },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    items: [
      { id: 'datasets', label: 'Datasets', path: '/datasets', icon: 'Database' },
      { id: 'reports', label: 'Reports', path: '/reports', icon: 'FileText' },
      { id: 'exports', label: 'Exports', path: '/exports', icon: 'Download' },
    ],
  },
  {
    id: 'decision',
    title: 'Decision Support',
    items: [
      { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', path: '/settings', icon: 'Settings' },
      { id: 'help', label: 'Help & Support', path: '/help', icon: 'HelpCircle' },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/monitoring': 'Live Monitoring',
  '/batteries': 'Batteries',
  '/alerts': 'Alerts',
  '/analytics/health': 'Health Analysis',
  '/analytics/degradation': 'Degradation Trends',
  '/analytics/cycles': 'Cycle Analysis',
  '/predictions': 'Predictions',
  '/predictions/live-demo': 'Live Prediction Demo',
  '/models/ahrf': 'AHRF Model',
  '/ai/explainability': 'Explainable AI',
  '/ai/model-comparison': 'Model Comparison',
  '/ai/optimization': 'Hyperparameter Optimization',
  '/ai/experiments': 'Experiments',
  '/datasets': 'Datasets',
  '/reports': 'Reports',
  '/exports': 'Exports',
  '/maintenance': 'Maintenance Recommendations',
  '/maintenance/history': 'Maintenance History',
  '/settings': 'Settings',
  '/settings/profile': 'Profile Settings',
  '/settings/notifications': 'Notification Settings',
  '/settings/system': 'System Settings',
  '/help': 'Help & Support',
  '/login': 'Sign In',
  '/signup': 'Create Account',
  '/forgot-password': 'Forgot Password',
};
