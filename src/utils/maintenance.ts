export function getMaintProjectsRootUrl({
  isPredPrev,
}: {
  isPredPrev: boolean;
}): `/${string}` {
  return `/manutencao/${isPredPrev ? "predprev" : "projetos"}`;
}
