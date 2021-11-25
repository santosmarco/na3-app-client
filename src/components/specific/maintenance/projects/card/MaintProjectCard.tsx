import { Typography } from "antd";
import React, { useMemo } from "react";

import { useNa3MaintProjects } from "../../../../../modules/na3-react";
import type { Na3MaintenanceProject } from "../../../../../modules/na3-types";
import { DataCard } from "../../../../ui/DataCard/DataCard";
import { MaintProjectCardHeader } from "./MaintProjectCardHeader";

type MaintProjectCardProps = {
  data: Na3MaintenanceProject;
  onSelect: (data: Na3MaintenanceProject) => void;
};

export function MaintProjectCard({
  data,
  onSelect,
}: MaintProjectCardProps): JSX.Element {
  const {
    helpers: { getProjectStatus, formatInternalId },
  } = useNa3MaintProjects();

  const projectStatus = useMemo(
    () => getProjectStatus(data),
    [getProjectStatus, data]
  );

  return (
    <DataCard
      data={data}
      header={
        <MaintProjectCardHeader
          isPredPrev={!!data.isPredPrev}
          priority={data.priority}
          status={projectStatus}
        />
      }
      onClick={onSelect}
      preTitle={formatInternalId(data.internalId)}
      title={data.title}
    >
      <Typography.Text italic={true}>{data.description}</Typography.Text>
    </DataCard>
  );
}
