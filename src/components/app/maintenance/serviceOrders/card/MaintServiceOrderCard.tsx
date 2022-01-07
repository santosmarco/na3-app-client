import { DataCard } from "@components";
import { useNa3Departments } from "@modules/na3-react";
import type { Na3ServiceOrder } from "@modules/na3-types";
import { Row } from "antd";
import React from "react";
import {
  IoCheckmarkDoneOutline,
  IoCreateOutline,
  IoLockClosedOutline,
  IoThumbsUpOutline,
} from "react-icons/io5";

import { ServiceOrderCardHeader } from "./ServiceOrderCardHeader";
import { ServiceOrderStep } from "./ServiceOrderStep";

type MaintServiceOrderCardProps = {
  data: Na3ServiceOrder;
  isStatusHidden?: boolean;
  onSelect: ((serviceOrder: Na3ServiceOrder) => void) | null;
  showDepartment?: boolean;
  showMachine?: boolean;
};

export function MaintServiceOrderCard({
  data,
  onSelect,
  isStatusHidden,
  showDepartment,
  showMachine,
}: MaintServiceOrderCardProps): JSX.Element {
  const {
    helpers: { getById: getDepartmentById, getDepartmentMachineById },
  } = useNa3Departments();

  return (
    <DataCard
      data={data}
      header={
        <ServiceOrderCardHeader
          dpt={showDepartment && getDepartmentById(data.username)}
          isStatusHidden={isStatusHidden}
          machine={
            showMachine && getDepartmentMachineById(data.username, data.machine)
          }
          priority={data.priority}
          status={data.status}
        />
      }
      onClick={onSelect}
      preTitle={`#${data.id}`}
      title={data.description}
    >
      <Row>
        <ServiceOrderStep
          icon={<IoCreateOutline />}
          timestamp={data.createdAt}
        />
        <ServiceOrderStep
          icon={<IoThumbsUpOutline />}
          timestamp={data.acceptedAt}
        />
        <ServiceOrderStep
          icon={<IoCheckmarkDoneOutline />}
          timestamp={data.solvedAt}
        />
        <ServiceOrderStep
          icon={<IoLockClosedOutline />}
          timestamp={data.closedAt}
        />
      </Row>
    </DataCard>
  );
}
