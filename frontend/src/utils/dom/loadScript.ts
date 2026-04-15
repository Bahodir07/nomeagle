/**
 * Runtime script loader for external scripts (e.g. /public/maps/*.js).
 * - Deduplicates by script src (id + data marker).
 * - Safe in React Strict Mode (shared promise for concurrent calls).
 * - Resolves when loaded, rejects on error.
 */

const LOADED_KEY = 'data-script-loaded';
const SRC_KEY = 'data-script-src';

const loadedScripts = new Set<string>();
const loadingScripts = new Map<string, Promise<void>>();

/**
 * Derives a stable DOM id from the script path for deduplication.
 */
function getScriptId(src: string): string {
  const normalized = src.replace(/^\//, '').replace(/[^a-zA-Z0-9-_.]/g, '-');
  return `script-${normalized}`;
}

/**
 * Normalizes script src to a canonical form (leading slash, no query hash for cache key).
 */
function normalizeSrc(src: string): string {
  const path = src.startsWith('/') ? src : `/${src}`;
  const withoutQuery = path.split('?')[0];
  return withoutQuery;
}

/**
 * Loads an external script by URL. Inserts at most one script tag per src.
 * Concurrent or Strict Mode double-mount calls receive the same promise.
 *
 * @param src - Script path, e.g. "/maps/mapdata.js" or "maps/worldmap.js"
 * @returns Promise that resolves when the script has loaded, rejects on error
 */
export function loadScript(src: string): Promise<void> {
  const normalizedSrc = normalizeSrc(src);

  if (loadedScripts.has(normalizedSrc)) {
    return Promise.resolve();
  }

  const pending = loadingScripts.get(normalizedSrc);
  if (pending) {
    return pending;
  }

  const scriptId = getScriptId(normalizedSrc);
  const existingEl = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (existingEl) {
    if (existingEl.getAttribute(LOADED_KEY) === 'true') {
      loadedScripts.add(normalizedSrc);
      return Promise.resolve();
    }
    if (existingEl.readyState === 'loaded' || existingEl.readyState === 'complete') {
      existingEl.setAttribute(LOADED_KEY, 'true');
      loadedScripts.add(normalizedSrc);
      return Promise.resolve();
    }
    const promise = new Promise<void>((resolve, reject) => {
      existingEl.onload = () => {
        existingEl.setAttribute(LOADED_KEY, 'true');
        loadedScripts.add(normalizedSrc);
        loadingScripts.delete(normalizedSrc);
        resolve();
      };
      existingEl.onerror = () => {
        loadingScripts.delete(normalizedSrc);
        reject(new Error(`Failed to load script: ${normalizedSrc}`));
      };
    });
    loadingScripts.set(normalizedSrc, promise);
    return promise;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.setAttribute(SRC_KEY, normalizedSrc);
    script.src = normalizedSrc;
    script.async = true;

    script.onload = () => {
      script.setAttribute(LOADED_KEY, 'true');
      loadedScripts.add(normalizedSrc);
      loadingScripts.delete(normalizedSrc);
      resolve();
    };
    script.onerror = () => {
      loadingScripts.delete(normalizedSrc);
      reject(new Error(`Failed to load script: ${normalizedSrc}`));
    };

    document.head.appendChild(script);
  });

  loadingScripts.set(normalizedSrc, promise);
  return promise;
}
