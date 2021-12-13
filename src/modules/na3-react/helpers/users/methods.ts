import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

import type { AppUserAttributes, AppUserMethods } from "../../types";

function createGetDepartmentsByTypeMethod(
  baseAppUser: AppUserAttributes
): AppUserMethods["getDepartmentsByType"] {
  return <T extends Na3DepartmentType>(
    departmentType: T
  ): Array<Na3Department<T>> => {
    return baseAppUser.departments.filter(
      (dpt): dpt is Na3Department<T> => dpt.type === departmentType
    );
  };
}

function createHasPrivilegesMethod(
  baseAppUser: AppUserAttributes
): AppUserMethods["hasPrivileges"] {
  return (
    privileges: Na3UserPrivilegeId | Na3UserPrivilegeId[],
    options?: { every?: boolean }
  ): boolean => {
    if (baseAppUser.isSuper || baseAppUser.privileges.includes("_super")) {
      return true;
    }

    const privArr = typeof privileges === "string" ? [privileges] : privileges;

    return privArr[options?.every ? "every" : "some"]((priv) =>
      baseAppUser.privileges.includes(priv)
    );
  };
}

function createIncludesDepartmentsMethod(
  baseAppUser: AppUserAttributes
): AppUserMethods["includesDepartments"] {
  return (
    query:
      Array<LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>> | Falsy | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>
  ): boolean => {
    const queryArr = typeof query === "string" ? [query] : query;

    return (queryArr || []).some((query) =>
      baseAppUser.departments.find(
        (dpt) => dpt.id === query || dpt.type === query
      )
    );
  };
}

export function buildAppUserMethods(
  baseAppUser: AppUserAttributes
): AppUserMethods {
  return {
    getDepartmentsByType: createGetDepartmentsByTypeMethod(baseAppUser),
    hasPrivileges: createHasPrivilegesMethod(baseAppUser),
    includesDepartments: createIncludesDepartmentsMethod(baseAppUser),
  };
}
