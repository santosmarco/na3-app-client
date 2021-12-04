import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3Position,
  Na3User,
  Na3UserAchievement,
  Na3UserEventData,
  Na3UserEventType,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import type { Dayjs } from "dayjs";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

import type { FirebaseNullOperationResult } from "../firebase/FirebaseOperation";

type AppUserRaw = Omit<
  Na3User,
  "createdAt" | "lastSeenAt" | "positionIds" | "updatedAt"
> & {
  readonly createdAt: Dayjs;
  readonly lastSeenAt: Dayjs;
  readonly updatedAt: Dayjs;
};

export type AppUserAttributes = AppUserRaw & {
  readonly achievements: Na3UserAchievement[];
  readonly compactDisplayName: string;
  readonly departments: Na3Department[];
  readonly fullName: string;
  readonly positions: Na3Position[];
  readonly privileges: Na3UserPrivilegeId[];
};

export type AppUserMethods = {
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
};

export type AppUser = AppUserAttributes & AppUserMethods;

export type AppUserAuthOnlyMethods = {
  readonly registerEvents: <T extends Na3UserEventType>(events: {
    [Type in T]: Na3UserEventData<Type>;
  }) => Promise<FirebaseNullOperationResult>;
  readonly updatePassword: (
    newPassword: string
  ) => Promise<
    | { error: FirebaseError; warning: null }
    | { error: null; warning: { message: string; title: string } }
    | { error: null; warning: null }
  >;
};

export type AppUserAuthenticated = AppUser & AppUserAuthOnlyMethods;
