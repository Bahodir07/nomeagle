/**
 * Environment configuration for the frontend application.
 * Exposes securely read environment variables with fallbacks.
 */

export const env = {
  /** The base URL of the Laravel API */
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};
