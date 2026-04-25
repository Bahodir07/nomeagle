import { createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes.app';
import { ProtectedRoute } from './guards';
import { LearningPathPage } from '../../pages/app/LearningPath';
import { CultureMatchRushPage } from '../../pages/app/Game/CultureMatchRushPage';
import { StreetFoodSprintPage } from '../../pages/app/Game/StreetFoodSprintPage';
import { FestivalTimelinePage } from '../../pages/app/Game/FestivalTimelinePage';
import { GuessTheLandmarkPage } from '../../pages/app/Game/GuessTheLandmarkPage';
import { LessonPage } from '../../pages/app/Lesson';
import { CountryRoadmapPage } from '../../pages/app/CountryRoadmap/CountryRoadmapPage';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '../../pages/auth';
import { LandingPage } from '../../pages/LandingPage';

/**
 * Application router.
 *
 * Route groups:
 *   /         → public LandingPage
 *   /login    → LoginPage (public)
 *   /register → RegisterPage (public)
 *   /app/*    → authenticated app shell (AppLayout, ProtectedRoute)
 *   /app/countries/:countryCode/* → full-screen pages (ProtectedRoute, no shell)
 *   /app/lesson/:lessonId         → full-screen lesson (ProtectedRoute, no shell)
 *   /learn/:countryCode           → public visual roadmap preview
 */
export const router = createBrowserRouter([
  /* Public landing page */
  {
    path: '/',
    element: <LandingPage />,
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
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },

  /* Public full-screen visual roadmap preview */
  {
    path: '/learn/:countryCode',
    element: <CountryRoadmapPage />,
  },

  /* Full-screen lesson roadmap (protected, no sidebar/topbar) */
  {
    path: '/app/countries/:countryCode/learn',
    element: (
      <ProtectedRoute>
        <LearningPathPage />
      </ProtectedRoute>
    ),
  },

  /* Full-screen Culture Match Rush game (protected) */
  {
    path: '/app/countries/:countryCode/game',
    element: (
      <ProtectedRoute>
        <CultureMatchRushPage />
      </ProtectedRoute>
    ),
  },

  /* Full-screen Street Food Sprint game (protected) */
  {
    path: '/app/countries/:countryCode/sprint',
    element: (
      <ProtectedRoute>
        <StreetFoodSprintPage />
      </ProtectedRoute>
    ),
  },

  /* Full-screen Festival Timeline game (protected) */
  {
    path: '/app/countries/:countryCode/festival',
    element: (
      <ProtectedRoute>
        <FestivalTimelinePage />
      </ProtectedRoute>
    ),
  },

  /* Full-screen Guess the Landmark game (protected) */
  {
    path: '/app/countries/:countryCode/landmarks',
    element: (
      <ProtectedRoute>
        <GuessTheLandmarkPage />
      </ProtectedRoute>
    ),
  },

  /* Full-screen Article Lesson (protected) */
  {
    path: '/app/lesson/:lessonId',
    element: (
      <ProtectedRoute>
        <LessonPage />
      </ProtectedRoute>
    ),
  },

  /* App routes (protected section) */
  ...appRoutes,
]);
