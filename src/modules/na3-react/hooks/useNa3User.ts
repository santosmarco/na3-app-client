import dayjs from "dayjs";
import { useMemo } from "react";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3Position,
  Na3User,
  Na3UserPrivilegeId,
} from "../../na3-types";
import type {
  AppUser,
  AppUserBase,
  AppUserGetDepartmentsByTypeHelper,
  AppUserHasPrivilegesHelper,
  AppUserHelpers,
  AppUserIncludesDepartmentsHelper,
} from "../types";
import { useStateSlice } from "./useStateSlice";

export function useNa3User(): AppUser | undefined {
  const { user } = useStateSlice("auth");
  const { data: departments } = useStateSlice("departments");

  const appUser = useMemo((): AppUser | undefined => {
    if (!user || !departments) {
      return;
    }

    const userPositions = getUserPositions(user, { departments });
    const userDepartments = getUserDepartments(userPositions, { departments });

    const baseUser: AppUserBase = {
      activityHistory: user.activityHistory,
      createdAt: dayjs(user.createdAt),
      departments: userDepartments,
      displayName: user.displayName,
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isSuper: user.isSuper,
      lastName: user.lastName,
      middleName: user.middleName,
      notificationTokens: user.notificationTokens,
      photoUrl: user.photoUrl,
      positions: userPositions,
      privileges: getUserPrivileges(userPositions),
      registrationId: user.registrationId,
      style: {
        backgroundColor:
          user.style.backgroundColor ||
          userDepartments[0].style.colors.background,
        color: user.style.color || userDepartments[0].style.colors.text,
      },
      updatedAt: dayjs(user.updatedAt),
    };

    const helpers: AppUserHelpers = {
      getDepartmentsByType: createGetDepartmentsByTypeHelper(baseUser),
      hasPrivileges: createHasPrivilegesHelper(baseUser),
      includesDepartments: createIncludesDepartmentsHelper(baseUser),
    };

    return { ...baseUser, ...helpers };
  }, [user, departments]);

  return appUser;
}

function getUserPositions(
  user: Na3User,
  dependencies: { departments: Na3Department[] }
): Na3Position[] {
  return user.positionIds
    .filter((posId, idx, arr) => arr.indexOf(posId) === idx)
    .map((posId) =>
      dependencies.departments
        .flatMap((dpt) => dpt.positions)
        .find((pos) => pos.id === posId)
    )
    .filter((pos): pos is NonNullable<typeof pos> => !!pos);
}

function getUserDepartments(
  userPositions: Na3Position[],
  dependencies: { departments: Na3Department[] }
): Na3Department[] {
  return userPositions
    .map((pos) => pos.departmentId)
    .filter((dptId, idx, arr) => arr.indexOf(dptId) === idx)
    .map((dptId) => dependencies.departments.find((dpt) => dpt.id === dptId))
    .filter((dpt): dpt is NonNullable<typeof dpt> => !!dpt);
}

function getUserPrivileges(userPositions: Na3Position[]): Na3UserPrivilegeId[] {
  return userPositions
    .flatMap((pos) => pos.privileges)
    .filter(
      (privilege, idx, arr): privilege is NonNullable<typeof privilege> =>
        !!privilege && arr.indexOf(privilege) === idx
    );
}

function createHasPrivilegesHelper(
  user: AppUserBase
): AppUserHasPrivilegesHelper {
  return (
    privileges: Na3UserPrivilegeId | Na3UserPrivilegeId[],
    options?: { all?: boolean }
  ): boolean => {
    if (user.isSuper) {
      return true;
    }

    const privArr = typeof privileges === "string" ? [privileges] : privileges;

    return privArr[options?.all ? "every" : "some"](
      (priv) =>
        (user.privileges.includes("all") && !priv.startsWith("_super_")) ||
        user.privileges.includes(priv)
    );
  };
}

function createIncludesDepartmentsHelper(
  user: AppUserBase
): AppUserIncludesDepartmentsHelper {
  return (
    query:
      | Falsy
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>[]
  ): boolean => {
    const queryArr = typeof query === "string" ? [query] : query;

    return (queryArr || []).some((query) =>
      user.departments.find((dpt) => dpt.id === query || dpt.type === query)
    );
  };
}

function createGetDepartmentsByTypeHelper(
  user: AppUserBase
): AppUserGetDepartmentsByTypeHelper {
  return <T extends Na3DepartmentType>(
    departmentType: T
  ): Na3Department<T>[] => {
    return user.departments.filter(
      (dpt): dpt is Na3Department<T> => dpt.type === departmentType
    );
  };
}
