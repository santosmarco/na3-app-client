import type {
  Na3Department,
  Na3Position,
  Na3User,
  Na3UserPrivilegeId,
} from "@modules/na3-types";

import { removeDuplicates, removeNullables } from "../utils";

export function formatRegistrationId(unformatted: string): string {
  return parseInt(unformatted).toString().padStart(4, "0");
}

export function getAuthEmail(registrationId: string): string {
  return `${formatRegistrationId(registrationId)}@novaa3-app.com.br`;
}

export function extractRegistrationIdFromEmail(
  email: string | null | undefined
): string | undefined {
  return email?.split("@")[0];
}

export function getUserPositions(
  user: Na3User,
  dependencies: { departments: Na3Department[] }
): Na3Position[] {
  return removeNullables(
    removeDuplicates(user.positionIds).map((posId) =>
      dependencies.departments
        .flatMap((dpt) => dpt.positions)
        .find((pos) => pos.id === posId)
    )
  );
}

export function getUserDepartments(
  userPositions: Na3Position[],
  dependencies: { departments: Na3Department[] }
): Na3Department[] {
  return removeNullables(
    removeDuplicates(userPositions.map((pos) => pos.departmentId)).map(
      (dptId) => dependencies.departments.find((dpt) => dpt.id === dptId)
    )
  );
}

export function getUserPrivileges(
  userPositions: Na3Position[]
): Na3UserPrivilegeId[] {
  return removeDuplicates(userPositions.flatMap((pos) => pos.privileges));
}
