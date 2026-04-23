import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { ProtectedRoute } from './guards';
import { AchievementsPage } from '../../pages/app/Achievements';
import { GamesPage } from '../../pages/app/Games';
import { DashboardPage } from '../../pages/app/Dashboard';
import { LeaderboardPage } from '../../pages/app/Leaderboard';
import { MapExplorerPage } from '../../pages/app/MapExplorer';
import { ProfilePage } from '../../pages/app/Profile';
import { SearchCountriesPage } from '../../pages/app/SearchCountries';
import { SettingsPage } from '../../pages/app/Settings';
import { StatisticsPage } from '../../pages/app/Statistics';
/**
 * Routes nested under /app — protected section of the application.
 *
 * Structure:
 *   /app              → redirect to /app/dashboard
 *   /app/dashboard    → DashboardPage
 *   /app/map          → MapExplorerPage (world map)
 *   /app/search       → SearchCountriesPage
 *   /app/stats        → StatisticsPage
 *   /app/achievements → AchievementsPage
 *   /app/leaderboard  → LeaderboardPage
 *   /app/profile      → ProfilePage
 *   /app/settings     → SettingsPage
 *
 * Note: /app/countries/:countryCode/learn is registered in router index
 * as a standalone full-screen route (no AppLayout).
 *
 * All children render inside AppLayout's <Outlet />.
 * When auth is added later, wrap `element` with a <ProtectedRoute> guard:
 *   element: <ProtectedRoute><AppLayout /></ProtectedRoute>
 */
export const appRoutes: RouteObject[] = [
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      /* /app → redirect to dashboard */
      { index: true, element: <Navigate to="dashboard" replace /> },

      /* /app/dashboard */
      { path: 'dashboard', element: <DashboardPage /> },

      /* /app/map — Map Explorer (world map) */
      { path: 'map', element: <MapExplorerPage /> },

      /* /app/search — Search Countries (catalog) */
      { path: 'search', element: <SearchCountriesPage /> },

      /* /app/stats — Statistics */
      { path: 'stats', element: <StatisticsPage /> },

      /* /app/games — Games hub */
      { path: 'games', element: <GamesPage /> },

      /* /app/achievements — Achievements / Badges */
      { path: 'achievements', element: <AchievementsPage /> },

      /* /app/leaderboard — Leaderboard */
      { path: 'leaderboard', element: <LeaderboardPage /> },

      /* /app/profile — Profile */
      { path: 'profile', element: <ProfilePage /> },

      /* /app/settings — Settings (theme, language, audio, notifications, account) */
      { path: 'settings', element: <SettingsPage /> },

    ],
  },
];
