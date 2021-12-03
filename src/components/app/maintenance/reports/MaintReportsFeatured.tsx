import type { Na3MaintenanceReportMonthly } from "@modules/na3-types";
import { Col, Pagination, Row } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";

import { MaintReportCard } from "./card/MaintReportCard";
import classes from "./MaintReportsFeatured.module.css";

type MaintReportsFeaturedProps = {
  monthly: Na3MaintenanceReportMonthly[];
};

export function MaintReportsFeatured({
  monthly,
}: MaintReportsFeaturedProps): JSX.Element {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  const handleMonthChange = useCallback((page: number) => {
    setSelectedMonthIdx(page - 1);
  }, []);

  const handlePaginationRenderItem = useCallback(
    (
      page: number,
      type: "jump-next" | "jump-prev" | "next" | "page" | "prev",
      originalEl: React.ReactNode
    ): React.ReactNode => {
      if (type === "page") {
        return (
          <div className={classes.PaginationPageItem}>
            {dayjs(
              new Date(monthly[page - 1].year, monthly[page - 1].month)
            ).format("MMM")}
          </div>
        );
      }
      return originalEl;
    },
    [monthly]
  );

  return (
    <>
      <Row gutter={[16, 8]}>
        <Col md={12} xs={24}>
          <MaintReportCard
            preTitle="Rel. mensal"
            report={monthly[selectedMonthIdx]}
            type="serviceOrders"
          />
        </Col>

        <Col md={12} xs={24}>
          <MaintReportCard
            preTitle="Rel. mensal"
            report={monthly[selectedMonthIdx]}
            type="projects"
          />
        </Col>
      </Row>

      <div className={classes.PaginationContainer}>
        <Pagination
          defaultCurrent={1}
          itemRender={handlePaginationRenderItem}
          onChange={handleMonthChange}
          pageSize={1}
          responsive={true}
          total={monthly.length}
        />
      </div>
    </>
  );
}
