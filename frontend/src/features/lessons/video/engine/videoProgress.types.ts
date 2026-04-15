export interface VideoProgressState {
    /** Current playback position in seconds. */
    currentSeconds: number;
    /** Total duration of the video in seconds. */
    durationSeconds: number;
    /** How much of the video has been watched (0–100). */
    watchedPct: number;
    /** Whether the completion threshold has been met. */
    completed: boolean;
}
