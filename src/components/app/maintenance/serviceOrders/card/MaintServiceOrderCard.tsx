import { Row } from "antd";
import React from "react";
import {
  IoCheckmarkDoneOutline,
  IoCreateOutline,
  IoLockClosedOutline,
  IoThumbsUpOutline,
} from "react-icons/io5";

import type { Na3ServiceOrder } from "../../../../../modules/na3-types";
import { DataCard } from "../../../../ui/DataCard/DataCard";
import { ServiceOrderCardHeader } from "./ServiceOrderCardHeader";
import { ServiceOrderStep } from "./ServiceOrderStep";

type MaintServiceOrderCardProps = {
  data: Na3ServiceOrder;
  isStatusHidden?: boolean;
  onSelect: ((serviceOrder: Na3ServiceOrder) => void) | null;
};

const defaultProps = {
  isStatusHidden: false,
};

export function MaintServiceOrderCard({
  data,
  onSelect,
  isStatusHidden,
}: MaintServiceOrderCardProps): JSX.Element {
  return (
    <DataCard
      data={data}
      header={
        (!isStatusHidden || (!!data.priority && data.status === "solving")) && (
          <ServiceOrderCardHeader
            isStatusHidden={isStatusHidden}
            priority={data.priority}
            status={data.status}
          />
        )
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

MaintServiceOrderCard.defaultProps = defaultProps;
