import React, { useCallback } from "react";

import { useNa3MaintProjects } from "../../../../modules/na3-react/hooks";
import type { Na3MaintenanceProject } from "../../../../modules/na3-types";
import { List } from "../../../lists/List";
import { MaintProjectCard } from "./card/MaintProjectCard";

type MaintProjectsListProps = {
  data: Na3MaintenanceProject[];
  onSelectProject: (project: Na3MaintenanceProject) => void;
};

export function MaintProjectsList({
  data,
  onSelectProject,
}: MaintProjectsListProps): JSX.Element {
  const maintProjects = useNa3MaintProjects();

  const handleRenderItem = useCallback(
    (project: Na3MaintenanceProject) => (
      <MaintProjectCard data={project} onSelect={onSelectProject} />
    ),
    [onSelectProject]
  );

  const handleFilterItemOnSearch = useCallback(
    (query: string): Na3MaintenanceProject[] =>
      data?.filter((project) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          project.title.toLowerCase().includes(formattedQuery) ||
          project.description.toLowerCase().includes(formattedQuery)
        );
      }) || [],
    [data]
  );

  return (
    <List
      data={data}
      error={maintProjects.error?.message}
      filterItem={handleFilterItemOnSearch}
      isLoading={maintProjects.loading}
      renderItem={handleRenderItem}
      verticalSpacing={8}
    />
  );
}
