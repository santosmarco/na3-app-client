import type { AppRoutePath } from "@config";
import type {
  Na3MaintenancePerson,
  Na3MaintenanceProjectChangeKey,
} from "@modules/na3-types";

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

export function isMaintProjectEditEventChangeKey(
  test: string
): test is Na3MaintenanceProjectChangeKey {
  const keys: Na3MaintenanceProjectChangeKey[] = [
    "description",
    "eta",
    "priority",
    "teamManager",
    "teamOthers",
    "title",
  ];

  return keys.some((key) => key === test);
}
