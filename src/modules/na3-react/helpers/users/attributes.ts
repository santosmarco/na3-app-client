import type {
  NA3_USER_ACHIEVEMENT_DEFINITIONS,
  Na3Department,
  Na3Position,
  Na3User,
  Na3UserAchievement,
  Na3UserAchievementLevel,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import dayjs from "dayjs";
import type { Falsy } from "utility-types";

import type { AppUserAttributes, AppUserScore } from "../../types";
import { handleFilterDuplicates, handleFilterFalsies } from "../../utils";

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
      ? `${firstNames[0]} ${firstNames
          .slice(1)
          .map((name) => name[0].toUpperCase())
          .filter(handleFilterFalsies)
          .join(" ")}`
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
  return positionIds
    .filter(handleFilterDuplicates)
    .map((posId) =>
      departments
        .flatMap((dpt) => dpt.positions)
        .find((pos) => pos.id === posId)
    )
    .filter(handleFilterFalsies);
}

function getUserDepartments(
  user: Na3User,
  { departments, ...deps }: UserAttrHelperDeps
): Na3Department[] {
  return getUserPositions(user, { departments, ...deps })
    .map((pos) => pos.departmentId)
    .filter(handleFilterDuplicates)
    .map((dptId) => departments.find((dpt) => dpt.id === dptId))
    .filter(handleFilterFalsies);
}

function getUserPrivileges(
  user: Na3User,
  dependencies: UserAttrHelperDeps
): Na3UserPrivilegeId[] {
  return getUserPositions(user, dependencies)
    .flatMap((pos) => pos.privileges)
    .filter(handleFilterDuplicates);
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

  return achievable.map((achievementDef): Na3UserAchievement => {
    const validEvents = user.activityHistory.filter(achievementDef.validator);
    const count = validEvents.length;

    if (achievementDef.type === "progressive") {
      const totalProgress = count;

      let currLvlIdx = achievementDef.levels.findIndex(
        (level) => level.goal > totalProgress
      );
      currLvlIdx =
        currLvlIdx === -1 ? achievementDef.levels.length - 1 : currLvlIdx;

      const { goal: currLvlGoal, score: currLvlScore } =
        achievementDef.levels[currLvlIdx];
      const remainingToNextLevel = currLvlGoal - totalProgress;
      const currLvlProgress = currLvlGoal - remainingToNextLevel;
      const currLvlProgressPercent =
        (currLvlProgress / (currLvlProgress + remainingToNextLevel)) * 100;

      const currLvl: Na3UserAchievementLevel = {
        idx: currLvlIdx,
        goal: currLvlGoal,
        score: currLvlScore,
        progress: currLvlProgress,
        progressPercent: currLvlProgressPercent,
        remainingToNextLevel,
      };

      const [currScore, totalScore, totalGoal] = achievementDef.levels.reduce(
        ([sumCurrScore, sumTotalScore, sumTotalGoal], level, idx) => [
          sumCurrScore + (idx < currLvlIdx ? level.score : 0),
          sumTotalScore + level.score,
          sumTotalGoal + level.goal,
        ],
        [0, 0, 0]
      );

      const totalProgressPercent = (totalProgress / totalGoal) * 100;

      const achieved = currLvlIdx === achievementDef.levels.length - 1;

      const achievedAt = achieved
        ? validEvents[currLvl.goal - 1]?.timestamp
        : null;

      return {
        ...achievementDef,
        totalProgress,
        currentLevel: currLvl,
        totalProgressPercent,
        currentScore: currScore,
        achieved,
        achievedAt,
        totalScore,
      };
    } else {
      const achieved = count > 0;
      const achievedAt = achieved ? validEvents[0]?.timestamp : null;

      return {
        ...achievementDef,
        count,
        achieved,
        achievedAt,
        currentScore: achieved ? achievementDef.totalScore : 0,
      };
    }
  });
}

function getUserScore(userAchievements: Na3UserAchievement[]): AppUserScore {
  const [current, total] = userAchievements.reduce(
    (arr, achievement) => [
      arr[0] + achievement.currentScore,
      arr[1] + achievement.totalScore,
    ],
    [0, 0]
  );

  return { current, total };
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
  const userAchievements = getUserAchievements();

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
    achievements: userAchievements,
    score: getUserScore(userAchievements),
  };
}
