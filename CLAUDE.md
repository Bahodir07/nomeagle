# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nomeagle** is a gamified, country-based interactive learning platform. Users learn through lessons (article, video, summary types) organized as Country → Module → Lesson, with scenarios, quizzes, and flashcards. Progress is tracked via XP, stars, streaks, and achievements.

## Repository Structure

```
nomeagle/
├── backend/       # Laravel 12 REST API + Filament admin panel
├── frontend/      # React 18 + TypeScript SPA
├── docker/        # Nginx + PHP Dockerfiles
└── docker-compose.yml
```

## Commands

### Backend (Laravel 12, PHP 8.2+)

```bash
cd backend

composer setup        # First-time setup: install deps, migrate, build assets
composer dev          # Start all dev services in parallel (server, queue, logs, Vite)
composer test         # Run PHPUnit test suite

php artisan migrate          # Run migrations
php artisan migrate:fresh --seed  # Reset and seed DB
npm run dev           # Vite dev server for admin assets
npm run build         # Build admin assets
```

### Frontend (React 18 + TypeScript)

```bash
cd frontend

npm install
npm run dev           # Dev server at http://127.0.0.1:5173
npm run build         # tsc + vite build
npm run preview       # Preview production build
```

### Docker

```bash
docker-compose up -d          # Start all services (PHP-FPM, Nginx :8000, MySQL :3307, Redis :6379)
docker-compose down
```

## Environment Setup

**Backend** — copy `backend/.env.example` to `backend/.env`:
- Default DB is SQLite; Docker Compose uses MySQL 8 on port 3307
- `APP_URL=http://localhost:8000`

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:
- `VITE_API_URL=http://localhost:8000/api`

## Auth Stack

This project uses **token-based Sanctum auth** (not cookie/session-based). Cross-domain CORS constraints require token auth — do not revert to cookie or session auth under any circumstance.

## Multi-Repo Deployment

The backend lives in `backend/` in this monorepo for local development, but is also pushed to a **separate standalone repo** for Laravel Cloud deployment via `git subtree`. After backend changes, push to BOTH repos. Always confirm the working directory before running git commands.

## Verification Before Edits

- Before claiming a package doesn't exist, verify with `composer search` or check Packagist (e.g. `laravel/boost` is a real package).
- When adding React Query hooks (`useQuery`, `useMutation`), verify `QueryClientProvider` is already set up in the app root.
- When changing env variables (especially `VITE_API_URL` or Sanctum config), verify login/auth flows still work.

## Database / Migrations

- When adding columns, check if they already exist (`Schema::hasColumn`) before adding — migrations may partially run on some environments.
- Composite indexes exist on all attempt/progress tables for `(user_id, created_at)` and `(user_id, status)` — use these columns in WHERE clauses for efficient queries.

## Backend Architecture

**Authentication:** Laravel Sanctum token-based API auth. The `AuthController` issues tokens on login/register.

**Content hierarchy:** `Country → Module → Lesson → (Scenario | QuizQuestion | Flashcard)`. Each entity has its own Eloquent model, API controller under `app/Http/Controllers/Api/`, and Filament resource under `app/Filament/Resources/`.

**Lesson types** are defined by the `LessonType` enum (`article`, `video`, `summary`) — used to determine which content fields and UI apply to a lesson.

**Progress tracking:** `user_lesson_progress`, `scenario_attempts`, `quiz_question_attempts`, `flashcard_reviews`, and `lesson_completion_events` tables record all user interactions. The `DashboardController` aggregates these for XP, streaks, and stats.

**Admin panel:** Filament 5 at `/admin`. All content (countries, modules, lessons, scenarios, quizzes, flashcards) and users are managed here. Filament resources live in `app/Filament/Resources/`.

**API routes** are in `routes/api.php`. All routes are prefixed `/api` and most require Sanctum `auth:sanctum` middleware.

## Frontend Architecture

**Routing:** React Router v7 — routes defined in `src/app/router/`.

**Server state:** TanStack React Query for all API calls. API functions live in `src/app/api/`.

**Client state:** Zustand stores in `src/app/store/` (auth state, UI state).

**Directory conventions:**
- `src/pages/` — page-level components (one directory per route)
- `src/features/` — domain feature modules (reusable cross-page logic)
- `src/components/` — shared UI components
- `src/entities/` — domain type definitions and entity-level logic
- `src/services/` — business logic not tied to a specific page

**Animations:** Framer Motion for transitions. Canvas-confetti for completion celebrations.

**Maps:** `react-simple-maps` + `d3-scale` for the world map (`src/pages/map/`) and course roadmap (`src/pages/map-roadmap/`).

## Testing

Backend tests use PHPUnit with an in-memory SQLite database (configured in `phpunit.xml`). Feature tests cover API endpoints; unit tests cover isolated logic.

```bash
cd backend
composer test                           # Full suite
php artisan test --filter=AuthTest      # Single test class
php artisan test --filter=test_login    # Single test method
```
