/* ==========================================================================
   Dashboard Data Types — Barrel Re-exports
   Kept for backward compatibility.
   Canonical types now live in:
     - src/types/models.ts  (core domain models)
     - src/features/dashboard/types.ts  (dashboard-specific composites)
   ========================================================================== */

export type { Region, CountryStatus, UserStats, CountryProgress } from './models';

export type {
  DashboardResponse,
  AsyncState,
} from '../features/dashboard/types';
