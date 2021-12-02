import type { WebColor } from "../../utils";
import type { Na3DepartmentId, Na3DepartmentType } from "../Na3Department";
import type { Na3UserEvent } from "./Na3UserEvent";

export type Na3UserAchievementId =
  | "service_orders_closed"
  | "service_orders_solved";

export type Na3UserAchievementIconId = "gi-auto-repair" | "gi-check-mark";

export type Na3UserAchievementLevel = {
  goal: number;
  score: number;
};

export type Na3UserAchievementValidator = (ev: Na3UserEvent) => boolean;

export type Na3UserAchievement<
  Id extends Na3UserAchievementId = Na3UserAchievementId
> = {
  color: WebColor;
  description: string;
  icon: Na3UserAchievementIconId;
  id: Id;
  levelDescriptor: `${string}{{remaining}}${string}`;
  levels: Na3UserAchievementLevel[];
  targetDepartments: (Na3DepartmentId | Na3DepartmentType)[];
  title: string;
  validate: Na3UserAchievementValidator;
};
