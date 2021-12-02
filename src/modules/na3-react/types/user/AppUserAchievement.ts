import type { Na3UserAchievement } from "@modules/na3-types";

export type AppUserAchievement = Na3UserAchievement & {
  currentLevel: number;
  progress: number;
  progressPercent: number;
};
