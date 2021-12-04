import type {
  NA3_USER_ACHIEVEMENT_DEFINITIONS,
  Na3Department,
  Na3Position,
  Na3User,
  Na3UserAchievement,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import dayjs from "dayjs";
import type { Falsy } from "utility-types";

import type { AppUserAttributes } from "../../types";
import { removeDuplicates, removeNullables } from "../../utils";

type UserAttributeHelpers = {
  getUserAchievements: () => Na3UserAchievement[];
  getUserCompactDisplayName: () => string;
  getUserDepartments: () => Na3Department[];
  getUserFormattedDisplayName: () => string;
  getUserFullName: () => string;
  getUserPositions: () => Na3Position[];
  getUserPrivileges: () => Na3UserPrivilegeId[];
};

type UserAttrHelperDeps = {
  achievementDefinitions: typeof NA3_USER_ACHIEVEMENT_DEFINITIONS;
  departments: Na3Department[];
};

type UserAttrBuilderDeps = {
  achievementDefinitions: typeof NA3_USER_ACHIEVEMENT_DEFINITIONS;
  departments: Falsy | Na3Department[];
};

function getUserFullName({ firstName, middleName, lastName }: Na3User): string {
  return [firstName, middleName, lastName]
    .filter((name): name is string => !!name)
    .map((name) => name.trim())
    .join(" ");
}

function getUserFormattedDisplayName({
  firstName,
  lastName,
  displayName,
}: Na3User): string {
  if (displayName.length <= 15) return displayName;

  const firstNames = firstName.split(" ").map((name) => name.trim());

  return `${
    firstNames.length > 1
      ? `${firstNames[0]} ${removeNullables(
          firstNames.slice(1).map((name) => name[0]?.toUpperCase() || undefined)
        ).join(" ")}`
      : firstNames[0]
  } ${lastName}`.trim();
}

function getUserCompactDisplayName({ firstName, lastName }: Na3User): string {
  return `${firstName.split(" ").map((name) => name.trim())[0]} ${
    lastName
      .split(" ")
      .map((name) => name.trim())
      .pop() || ""
  }`.trim();
}

function getUserPositions(
  { positionIds }: Na3User,
  { departments }: UserAttrHelperDeps
): Na3Position[] {
  return removeNullables(
    removeDuplicates(positionIds).map((posId) =>
      departments
        .flatMap((dpt) => dpt.positions)
        .find((pos) => pos.id === posId)
    )
  );
}

function getUserDepartments(
  user: Na3User,
  { departments, ...deps }: UserAttrHelperDeps
): Na3Department[] {
  return removeNullables(
    removeDuplicates(
      getUserPositions(user, { departments, ...deps }).map(
        (pos) => pos.departmentId
      )
    ).map((dptId) => departments.find((dpt) => dpt.id === dptId))
  );
}

function getUserPrivileges(
  user: Na3User,
  dependencies: UserAttrHelperDeps
): Na3UserPrivilegeId[] {
  return removeDuplicates(
    getUserPositions(user, dependencies).flatMap((pos) => pos.privileges)
  );
}

function getUserAchievements(
  user: Na3User,
  dependencies: UserAttrHelperDeps
): Na3UserAchievement[] {
  const { achievementDefinitions: definitions } = dependencies;

  const userDpts = getUserDepartments(user, dependencies);
  const achievable = Object.values(definitions).filter(
    (achievementDef) =>
      achievementDef.targetDepartments === "all" ||
      achievementDef.targetDepartments.some((targetDpt) =>
        userDpts.flatMap((dpt) => [dpt.id, dpt.type]).includes(targetDpt)
      )
  );

  return achievable.map((achievementDef) => {
    const validEvents = user.activityHistory.filter(achievementDef.validator);
    const count = validEvents.length;

    if (achievementDef.type === "progressive") {
      const progress = count;
      const currentLevelIdx = achievementDef.levels.filter(
        (level) => level.goal < progress
      ).length;
      const currentLevel =
        currentLevelIdx < achievementDef.levels.length
          ? achievementDef.levels[currentLevelIdx]
          : undefined;
      const progressPercent = progress / (currentLevel?.goal || progress);
      const currentScore = achievementDef.levels
        .slice(0, currentLevelIdx)
        .reduce((sum, level) => sum + level.score, 0);
      const remainingToNextLevel = (currentLevel?.goal || progress) - progress;
      const achieved =
        achievementDef.levels.reduce((sum, level) => sum + level.score, 0) <=
        currentScore;
      const achievedAt = achieved
        ? validEvents[
            achievementDef.levels.reduce((sum, level) => sum + level.goal, 0)
          ]?.timestamp
        : null;

      return {
        ...achievementDef,
        progress,
        currentLevel: currentLevelIdx,
        progressPercent,
        currentScore,
        achieved,
        remainingToNextLevel,
        achievedAt,
      };
    } else {
      const achieved = count > 0;
      const achievedAt = achieved ? validEvents[0]?.timestamp : null;

      return { ...achievementDef, count, achieved, achievedAt };
    }
  });
}

function getUserAttributeHelpers(
  user: Na3User,
  deps: UserAttrHelperDeps
): UserAttributeHelpers {
  return {
    getUserCompactDisplayName: (): string => getUserCompactDisplayName(user),
    getUserDepartments: (): Na3Department[] => getUserDepartments(user, deps),
    getUserPositions: (): Na3Position[] => getUserPositions(user, deps),
    getUserPrivileges: (): Na3UserPrivilegeId[] =>
      getUserPrivileges(user, deps),
    getUserFormattedDisplayName: (): string =>
      getUserFormattedDisplayName(user),
    getUserFullName: (): string => getUserFullName(user),
    getUserAchievements: (): Na3UserAchievement[] =>
      getUserAchievements(user, deps),
  };
}

export function buildAppUserAttributes(
  na3User: Na3User,
  dependencies: UserAttrBuilderDeps
): AppUserAttributes {
  const departments = [...(dependencies.departments || [])];

  const {
    getUserPositions,
    getUserDepartments,
    getUserPrivileges,
    getUserFormattedDisplayName,
    getUserCompactDisplayName,
    getUserAchievements,
    getUserFullName,
  } = getUserAttributeHelpers(na3User, { ...dependencies, departments });

  const userPositions = getUserPositions();
  const userDepartments = getUserDepartments();

  return {
    activityHistory: na3User.activityHistory,
    createdAt: dayjs(na3User.createdAt),
    departments: userDepartments,
    displayName: getUserFormattedDisplayName(),
    email: na3User.email,
    firstName: na3User.firstName,
    uid: na3User.uid,
    isActive: na3User.isActive,
    isPasswordDefault: na3User.isPasswordDefault,
    isEmailVerified: na3User.isEmailVerified,
    isSuper: na3User.isSuper,
    lastName: na3User.lastName,
    middleName: na3User.middleName,
    compactDisplayName: getUserCompactDisplayName(),
    notificationTokens: na3User.notificationTokens,
    photoUrl: na3User.photoUrl,
    positions: userPositions,
    privileges: getUserPrivileges(),
    registrationId: na3User.registrationId,
    style: na3User.style,
    updatedAt: dayjs(na3User.updatedAt),
    bio: na3User.bio,
    fullName: getUserFullName(),
    lastSeenAt: dayjs(na3User.lastSeenAt),
    achievements: getUserAchievements(),
  };
}
