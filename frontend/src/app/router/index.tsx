import { createBrowserRouter, Navigate } from 'react-router-dom';
import { appRoutes } from './routes.app';
import { LearningPathPage } from '../../pages/app/LearningPath';
import { CultureMatchRushPage } from '../../pages/app/Game/CultureMatchRushPage';
import { StreetFoodSprintPage } from '../../pages/app/Game/StreetFoodSprintPage';
import { FestivalTimelinePage } from '../../pages/app/Game/FestivalTimelinePage';
import { GuessTheLandmarkPage } from '../../pages/app/Game/GuessTheLandmarkPage';
import { LessonPage } from '../../pages/app/Lesson';
import { CountryRoadmapPage } from '../../pages/app/CountryRoadmap/CountryRoadmapPage';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginPage, RegisterPage } from '../../pages/auth';

/**
 * Application router.
 *
 * Route groups:
 *   /app/*    → authenticated app shell (AppLayout)
 *   /app/countries/:countryCode/learn → full-screen lesson page (no shell)
 *   /app/countries/:countryCode/game  → full-screen Culture Match Rush game (no shell)
 *   /         → redirect to /app/dashboard
 */
export const router = createBrowserRouter([
  /* Root redirect */
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },

  /* Auth Routes */
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  /* New full-screen visual roadmap page */
  {
    path: '/learn/:countryCode',
    element: <CountryRoadmapPage />,
  },

  /* Full-screen lesson roadmap (no sidebar/topbar) */
  {
    path: '/app/countries/:countryCode/learn',
    element: <LearningPathPage />,
  },

  /* Full-screen Culture Match Rush game */
  {
    path: '/app/countries/:countryCode/game',
    element: <CultureMatchRushPage />,
  },

  /* Full-screen Street Food Sprint game */
  {
    path: '/app/countries/:countryCode/sprint',
    element: <StreetFoodSprintPage />,
  },

  /* Full-screen Festival Timeline game */
  {
    path: '/app/countries/:countryCode/festival',
    element: <FestivalTimelinePage />,
  },

  /* Full-screen Guess the Landmark game */
  {
    path: '/app/countries/:countryCode/landmarks',
    element: <GuessTheLandmarkPage />,
  },

  /* Full-screen Article Lesson */
  {
    path: '/app/lesson/:lessonId',
    element: <LessonPage />,
  },

  /* App routes (protected section) */
  ...appRoutes,
]);
