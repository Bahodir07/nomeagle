import { http } from "./http";
import type { AchievementsContext } from "../../features/achievements/types";

export async function getAchievements(): Promise<AchievementsContext> {
    const { data } = await http.get<AchievementsContext>("/api/achievements");
    return data;
}
