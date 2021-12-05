import type { WebColor } from "../../utils";
import type { Na3DepartmentId, Na3DepartmentType } from "../Na3Department";
import type { Na3UserEvent } from "./Na3UserEvent";

export type Na3UserAchievementType = "one-time" | "progressive";

export type Na3UserAchievementId =
  | "service_orders_closed"
  | "service_orders_solved"
  | "user_set_bio";

export type Na3UserAchievementIconId =
  | "check"
  | "heart"
  | "repair-user"
  | "repair";

export type Na3UserAchievementLevelDefinition = {
  goal: number;
  score: number;
};

export type Na3UserAchievementLevel = Na3UserAchievementLevelDefinition & {
  idx: number;
  progress: number;
  progressPercent: number;
  remainingToNextLevel: number;
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
      levelDescriptor: (
        achievement: Na3UserAchievementProgressive,
        levelIdx: number
      ) => string;
      levels: Na3UserAchievementLevelDefinition[];
      type: "progressive";
    }
  | {
      levelDescriptor: string;
      totalScore: number;
      type: "one-time";
    }
);

type Na3UserAchievementDynamic = Na3UserAchievementDefinition & {
  achieved: boolean;
  achievedAt: string | null;
  currentScore: number;
  totalScore: number;
};

type Na3UserAchievementProgressive = Na3UserAchievementDynamic & {
  currentLevel: Na3UserAchievementLevel;
  totalProgress: number;
  totalProgressPercent: number;
  type: "progressive";
};

type Na3UserAchievementOneTime = Na3UserAchievementDynamic & {
  count: number;
  type: "one-time";
};

export type Na3UserAchievement =
  | Na3UserAchievementOneTime
  | Na3UserAchievementProgressive;
