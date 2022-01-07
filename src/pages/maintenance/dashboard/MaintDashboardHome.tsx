import {
  MaintDashboardColumn,
  MaintServiceOrdersList,
  PageAlert,
  PageTitle,
} from "@components";
import { useQuery } from "@hooks";
import { useNa3ServiceOrders } from "@modules/na3-react";
import type { Na3ServiceOrder } from "@modules/na3-types";
import { Grid, Input, Row } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useDebouncedValue } from "rooks";

import { MaintServiceOrderDetailsPage } from "../serviceOrders/MaintServiceOrderDetails";
import classes from "./MaintDashboardHome.module.css";

export function MaintDashboardHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("numero");

  const breakpoint = Grid.useBreakpoint();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  const serviceOrders = useNa3ServiceOrders();

  const serviceOrdersByStatus = useMemo(() => {
    let searchFilteredData = serviceOrders.data || [];
    if (debouncedSearchQuery) {
      searchFilteredData = searchFilteredData.filter(
        (order) =>
          order.description.toLowerCase().includes(debouncedSearchQuery) ||
          order.dpt.toLowerCase().includes(debouncedSearchQuery) ||
          parseInt(order.id) === parseInt(debouncedSearchQuery)
      );
    }
    return serviceOrders.helpers.mapByStatus(searchFilteredData);
  }, [serviceOrders.data, serviceOrders.helpers, debouncedSearchQuery]);

  const mobileListData = useMemo(
    () => [
      ...serviceOrders.helpers.sortByStatus(["pending"]).reverse(),
      ...serviceOrders.helpers.sortByPriority(
        serviceOrders.helpers.sortByStatus(["solving"])
      ),
    ],
    [serviceOrders.helpers]
  );

  const handleOrderSelect = useCallback(
    (serviceOrder: Na3ServiceOrder) => {
      history.push(`/manutencao/dashboard?numero=${serviceOrder.id}`);
    },
    [history]
  );

  const handleSearchChange = useCallback(
    (eventOrValue: React.ChangeEvent<HTMLInputElement> | string): void => {
      const input =
        typeof eventOrValue === "string"
          ? eventOrValue
          : eventOrValue.target.value;
      const query = input.trim().toLowerCase();
      setSearchQuery(query);
    },
    []
  );

  return query.numero ? (
    <MaintServiceOrderDetailsPage
      hasCameFromDashboard={true}
      serviceOrderId={query.numero}
    />
  ) : (
    <>
      <PageTitle>
        Manutenção • {breakpoint.lg ? "Dashboard" : "OS Pendentes"}
      </PageTitle>

      {!breakpoint.lg && (
        <PageAlert type="warning">
          Esta página é melhor visualizada no computador.
        </PageAlert>
      )}

      <Input.Search
        className={classes.Search}
        enterButton={true}
        onChange={handleSearchChange}
        onSearch={handleSearchChange}
        placeholder="Pesquisar OS..."
      />

      {breakpoint.lg ? (
        <Row className={classes.DashboardRow} gutter={16}>
          <MaintDashboardColumn
            className={classes.DashboardCol}
            data={serviceOrdersByStatus.pending}
            onSelectOrder={handleOrderSelect}
            status="pending"
          />

          <MaintDashboardColumn
            className={classes.DashboardCol}
            data={serviceOrders.helpers.sortByPriority(
              serviceOrdersByStatus.solving
            )}
            onSelectOrder={handleOrderSelect}
            status="solving"
          />

          <MaintDashboardColumn
            className={classes.DashboardCol}
            data={serviceOrdersByStatus.solved}
            onSelectOrder={handleOrderSelect}
            status="solved"
          />

          <MaintDashboardColumn
            className={classes.DashboardCol}
            data={serviceOrdersByStatus.closed.reverse()}
            onSelectOrder={handleOrderSelect}
            status="closed"
          />
        </Row>
      ) : (
        <MaintServiceOrdersList
          cardRenderOptions={{ hideUrgencyRibbon: true }}
          data={mobileListData}
          onSelectOrder={handleOrderSelect}
        />
      )}
    </>
  );
}
