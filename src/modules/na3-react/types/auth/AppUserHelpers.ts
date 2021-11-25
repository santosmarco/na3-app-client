import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3UserPrivilegeId,
} from "../../../na3-types";

export type AppUserHasPrivilegesHelper = (
  privileges: Na3UserPrivilegeId | Na3UserPrivilegeId[],
  options?: { all?: boolean }
) => boolean;

export type AppUserIncludesDepartmentsHelper = (
  query:
    | Falsy
    | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>
    | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>[]
) => boolean;

export type AppUserGetDepartmentsByTypeHelper = <T extends Na3DepartmentType>(
  departmentType: T
) => Na3Department<T>[];

export type AppUserHelpers = {
  readonly getDepartmentsByType: AppUserGetDepartmentsByTypeHelper;
  readonly hasPrivileges: AppUserHasPrivilegesHelper;
  readonly includesDepartments: AppUserIncludesDepartmentsHelper;
};
