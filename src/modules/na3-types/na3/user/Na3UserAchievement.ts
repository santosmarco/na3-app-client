import type { WebColor } from "../../utils";
import type { Na3DepartmentId, Na3DepartmentType } from "../Na3Department";
import type { Na3UserEvent } from "./Na3UserEvent";

export type Na3UserAchievementType = "one-time" | "progressive";

export type Na3UserAchievementId =
  | "service_orders_closed"
  | "service_orders_solved"
  | "user_set_bio";

export type Na3UserAchievementIconId = "check" | "heart" | "repair";

export type Na3UserAchievementLevel = {
  goal: number;
  score: number;
};

export type Na3UserAchievementDefinition = {
  color: WebColor;
  description: string;
  icon: Na3UserAchievementIconId;
  id: Na3UserAchievementId;
  targetDepartments: (Na3DepartmentId | Na3DepartmentType)[] | "all";
  title: string;
  validator: (ev: Na3UserEvent) => boolean;
} & (
  | {
      levelDescriptor: (achievement: Na3UserAchievementProgressive) => string;
      levels: Na3UserAchievementLevel[];
      type: "progressive";
    }
  | {
      levelDescriptor: string;
      score: number;
      type: "one-time";
    }
);

type Na3UserAchievementBase = Na3UserAchievementDefinition & {
  achieved: boolean;
  achievedAt: string | null;
};

type Na3UserAchievementProgressive = Na3UserAchievementBase & {
  currentLevel: number;
  currentScore: number;
  progress: number;
  progressPercent: number;
  remainingToNextLevel: number;
  type: "progressive";
};

type Na3UserAchievementOneTime = Na3UserAchievementBase & {
  count: number;
  type: "one-time";
};

export type Na3UserAchievement =
  | Na3UserAchievementOneTime
  | Na3UserAchievementProgressive;
