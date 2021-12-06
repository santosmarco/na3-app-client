import type { Na3MaintenancePerson } from "@modules/na3-types";
import type { ConditionalKeys, Primitive } from "type-fest";

import type { AppUser, ConfigState } from "../../types";

export function resolveCollectionId(
  collectionId:
    | "API-PEOPLE"
    | "API-PRODUCTS"
    | "departments"
    | "docs-std"
    | "manut-projects"
    | "tickets"
    | "transf-label-templates"
    | "users",
  environment: ConfigState["environment"],
  options?: { forceProduction?: boolean }
): string {
  return environment === "production" || options?.forceProduction
    ? collectionId
    : `TEST-${collectionId}`;
}

export function sanitizeAppUserForFirestore<
  T extends Partial<AppUser>,
  U extends ConditionalKeys<T, Primitive>
>(appUser: T, keysToKeep: U[]): Record<U, T[U]> {
  return keysToKeep.reduce(
    (sanitized, key) => ({ ...sanitized, [key]: appUser[key] }),
    {} as Record<U, T[U]>
  );
}

export function sanitizeUserToMaintPerson(
  appUser: AppUser
): Na3MaintenancePerson {
  return sanitizeAppUserForFirestore(appUser, ["uid", "displayName"]);
}
