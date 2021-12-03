import { Tag } from "@components";
import React from "react";

type MaintReportCardHeaderProps = {
  projectCount: number;
  serviceOrderCount: number;
};

export function MaintReportCardHeader({
  projectCount,
  serviceOrderCount,
}: MaintReportCardHeaderProps): JSX.Element {
  return (
    <>
      {!!serviceOrderCount && <Tag color="blue">{serviceOrderCount} OS</Tag>}
      {!!projectCount && (
        <Tag color="red">
          {projectCount} PROJETO{projectCount === 1 ? "" : "S"}
        </Tag>
      )}
    </>
  );
}
