/**
 * Calculate the percentage of the video watched (0–100).
 * Returns 0 when durationSeconds is zero or negative.
 */
export function getWatchedPct(
    currentSeconds: number,
    durationSeconds: number,
): number {
    if (durationSeconds <= 0) return 0;
    const pct = (currentSeconds / durationSeconds) * 100;
    return Math.min(Math.max(Math.round(pct), 0), 100);
}

/**
 * Determine whether the user has met the lesson's completion threshold.
 */
export function isVideoCompleted(
    currentSeconds: number,
    durationSeconds: number,
    thresholdPct: number,
): boolean {
    return getWatchedPct(currentSeconds, durationSeconds) >= thresholdPct;
}

/**
 * Clamp a time value between 0 and durationSeconds.
 */
export function clampTime(
    seconds: number,
    durationSeconds: number,
): number {
    return Math.min(Math.max(seconds, 0), Math.max(durationSeconds, 0));
}

/**
 * Format seconds into "m:ss" or "h:mm:ss" display string.
 */
export function formatVideoTime(seconds: number): string {
    const safe = Math.max(Math.round(seconds), 0);
    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const s = safe % 60;

    const ss = String(s).padStart(2, '0');

    if (h > 0) {
        const mm = String(m).padStart(2, '0');
        return `${h}:${mm}:${ss}`;
    }

    return `${m}:${ss}`;
}
