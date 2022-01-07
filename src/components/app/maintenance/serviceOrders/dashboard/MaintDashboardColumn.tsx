import type { MaintServiceOrderCardRenderOptions } from "@components";
import {
  Divider,
  MaintServiceOrdersList,
  Page,
  ServiceOrderStatusBadge,
} from "@components";
import type { Na3ServiceOrder } from "@modules/na3-types";
import { Card, Col, Statistic } from "antd";
import React, { useMemo } from "react";

import classes from "./MaintDashboardColumn.module.css";

type MaintDashboardColumnProps = {
  className?: string;
  data: Na3ServiceOrder[];
  dividerClassName?: string;
  onSelectOrder: ((serviceOrder: Na3ServiceOrder) => void) | null;
  status: Na3ServiceOrder["status"];
};

const defaultProps = {
  className: undefined,
  dividerClassName: undefined,
};

export function MaintDashboardColumn({
  data,
  onSelectOrder,
  status,
  className,
  dividerClassName,
}: MaintDashboardColumnProps): JSX.Element {
  const cardRenderOptions = useMemo(
    (): MaintServiceOrderCardRenderOptions => ({
      hideStatus: true,
      hideUrgencyRibbon: true,
      showDepartment: true,
      showMachine: true,
    }),
    []
  );

  return (
    <Col className={className} span={6}>
      <Card className={classes.StatisticCard}>
        <Statistic
          title={<ServiceOrderStatusBadge status={status} />}
          value={data.length}
        />
      </Card>

      <Divider className={dividerClassName} marginBottom={0} marginTop={8} />

      <Page additionalPaddingBottom={8}>
        <MaintServiceOrdersList
          cardRenderOptions={cardRenderOptions}
          data={data}
          isSearchDisabled={true}
          onSelectOrder={onSelectOrder}
        />
      </Page>
    </Col>
  );
}

MaintDashboardColumn.defaultProps = defaultProps;
