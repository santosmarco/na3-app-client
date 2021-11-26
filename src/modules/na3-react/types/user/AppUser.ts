import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3Position,
  Na3User,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import type { Dayjs } from "dayjs";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

export interface AppUser
  extends Omit<
    Na3User,
    "createdAt" | "lastSeenAt" | "positionIds" | "style" | "updatedAt"
  > {
  readonly createdAt: Dayjs;
  readonly lastSeenAt: Dayjs;
  readonly style: {
    readonly backgroundColor: string;
    readonly color: string;
  };
  readonly updatedAt: Dayjs;
}

export interface AppUser {
  readonly departments: Na3Department[];
  readonly isLoading: boolean;
  readonly positions: Na3Position[];
  readonly privileges: Na3UserPrivilegeId[];
}

export interface AppUser {
  readonly getDepartmentsByType: <T extends Na3DepartmentType>(
    departmentType: T
  ) => Na3Department<T>[];
  readonly hasPrivileges: (
    privileges: Na3UserPrivilegeId | Na3UserPrivilegeId[],
    options?: { every?: boolean }
  ) => boolean;
  readonly includesDepartments: (
    query:
      | Falsy
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>[]
  ) => boolean;
  readonly updatePassword: (
    newPassword: string
  ) => Promise<
    | { error: FirebaseError; warning: null }
    | { error: null; warning: { message: string; title: string } }
    | { error: null; warning: null }
  >;
}
