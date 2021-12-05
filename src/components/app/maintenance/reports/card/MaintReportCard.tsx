import { DataCard } from "@components";
import type { Na3MaintenanceReport } from "@modules/na3-types";
import React, { useMemo } from "react";

import { MaintReportCardHeader } from "./MaintReportCardHeader";

type MaintReportCardProps = {
  onClick: ((report: Na3MaintenanceReport) => void) | null | undefined;
  preTitle?: string;
  report: Na3MaintenanceReport;
  title?: string;
  type?: "both" | "projects" | "serviceOrders";
};

export function MaintReportCard({
  title,
  report,
  type,
  preTitle,
  onClick,
}: MaintReportCardProps): JSX.Element {
  const reportData = useMemo((): Na3MaintenanceReport => {
    if (type === "serviceOrders") return { ...report, projects: [] };
    else if (type === "projects") return { ...report, serviceOrders: [] };
    else return { ...report };
  }, [report, type]);

  return (
    <DataCard
      data={reportData}
      header={
        <MaintReportCardHeader
          projectCount={reportData.projects.length}
          serviceOrderCount={reportData.serviceOrders.length}
        />
      }
      onClick={onClick}
      preTitle={preTitle}
      title={title || reportData.title}
    />
  );
}
