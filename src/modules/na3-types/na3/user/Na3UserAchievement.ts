import type { WebColor } from "../../utils";
import type { Na3DepartmentType } from "..";
import type { Na3DepartmentId } from "../Na3Department";

export type Na3UserAchievementId =
  | "service_orders_closed"
  | "service_orders_solved";

export type Na3UserAchievementIconId = "gi-auto-repair" | "gi-check-mark";

export type Na3UserAchievementLevel = {
  goal: number;
  points: number;
};

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
};
