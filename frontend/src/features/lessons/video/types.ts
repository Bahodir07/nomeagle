export interface VideoTranscriptBlock {
    id: string;
    text: string;
    startSeconds?: number;
    endSeconds?: number;
}

export interface VideoLesson {
    lessonId: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    durationSeconds: number;
    transcript: VideoTranscriptBlock[];
    /** Percentage of the video the user must watch to mark the lesson complete (0–100). */
    completionThresholdPct: number;
    xpReward: number;
}
