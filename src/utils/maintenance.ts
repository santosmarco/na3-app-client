import type { AppRoutePath } from "@config";
import type { Na3MaintenancePerson } from "@modules/na3-types";

export function getMaintProjectsRootUrl({
  isPredPrev,
}: {
  isPredPrev: boolean;
}): AppRoutePath {
  return `/manutencao/${isPredPrev ? "predprev" : "projetos"}`;
}

export function getMaintPersonDisplayName(
  maintenancePerson: Na3MaintenancePerson | string
): string {
  if (typeof maintenancePerson === "string") {
    return maintenancePerson.trim();
  }
  return maintenancePerson.displayName;
}
