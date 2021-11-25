import type { ConfigState } from "../../types";

export function resolveCollectionId(
  collectionId:
    | "API-PEOPLE"
    | "API-PRODUCTS"
    | "departments"
    | "manut-projects"
    | "NA3-USERS"
    | "tickets"
    | "transf-label-templates",
  environment: ConfigState["environment"],
  options?: { forceProduction?: boolean }
): string {
  return environment === "production" || options?.forceProduction
    ? collectionId
    : `TEST-${collectionId}`;
}
