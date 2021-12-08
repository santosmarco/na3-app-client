import type {
  Na3ApiPerson,
  Na3ApiProduct,
  Na3Department,
  Na3MaintenancePerson,
  Na3MaintenanceProject,
  Na3ServiceOrder,
  Na3StdDocument,
  Na3TransfLabelTemplate,
  Na3User,
} from "@modules/na3-types";
import type { CollectionReference } from "firebase/firestore";
import { collection, getFirestore } from "firebase/firestore";
import type { ConditionalKeys, Primitive } from "type-fest";

import type { AppUser, ConfigState } from "../../types";

type CollectionIdDataMap = {
  "API-PEOPLE": Na3ApiPerson;
  "API-PRODUCTS": Na3ApiProduct;
  departments: Na3Department;
  "docs-std": Na3StdDocument;
  "manut-projects": Na3MaintenanceProject;
  tickets: Na3ServiceOrder;
  "transf-label-templates": Na3TransfLabelTemplate;
  users: Na3User;
};

type CollectionId = keyof CollectionIdDataMap;

type CollectionData<T extends CollectionId> = CollectionIdDataMap[T];

type CollectionOptions = { forceProduction?: boolean };

export function resolveCollectionId(
  collectionId: CollectionId,
  environment: ConfigState["environment"],
  options?: CollectionOptions
): string {
  return environment === "production" || options?.forceProduction
    ? collectionId
    : `TEST-${collectionId}`;
}

export function getCollection<T extends CollectionId>(
  collectionId: T,
  environment: ConfigState["environment"],
  options?: CollectionOptions
): CollectionReference<CollectionData<T>> {
  return collection(
    getFirestore(),
    resolveCollectionId(collectionId, environment, options)
  ) as CollectionReference<CollectionData<T>>;
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
