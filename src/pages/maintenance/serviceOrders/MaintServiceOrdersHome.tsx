import {
  ListFormPage,
  MaintCreateServiceOrderForm,
  MaintServiceOrdersList,
} from "@components";
import { useQuery } from "@hooks";
import { useCurrentUser, useNa3ServiceOrders } from "@modules/na3-react";
import type { Na3ServiceOrder } from "@modules/na3-types";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { MaintServiceOrderDetailsPage } from "./MaintServiceOrderDetails";

export function MaintServiceOrdersHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("numero");

  const user = useCurrentUser();
  const serviceOrders = useNa3ServiceOrders();

  const userOrders = useMemo(
    () => serviceOrders.helpers.getUserOrders(),
    [serviceOrders.helpers]
  );

  const listData = useMemo(
    () =>
      user?.hasPrivileges("service_orders_write_shop_floor")
        ? [
            ...serviceOrders.helpers
              .sortByStatus(["solved"], userOrders)
              .reverse(),
            ...serviceOrders.helpers.sortByPriority(
              serviceOrders.helpers.sortByStatus(["solving"], userOrders)
            ),
            ...serviceOrders.helpers
              .sortByStatus(["closed", "pending"], userOrders)
              .reverse(),
          ]
        : [
            ...serviceOrders.helpers.sortByStatus(["pending"]).reverse(),
            ...serviceOrders.helpers.sortByPriority(
              serviceOrders.helpers.sortByStatus(["solving"])
            ),
            ...serviceOrders.helpers
              .sortByStatus(["closed", "solved"], userOrders)
              .reverse(),
          ],
    [serviceOrders.helpers, userOrders, user]
  );

  const handleCreateServiceOrderClick = useCallback(() => {
    history.push("/manutencao/os/abrir-os");
  }, [history]);

  const handleOrderSelect = useCallback(
    (serviceOrder: Na3ServiceOrder) => {
      history.push(`/manutencao/os?numero=${serviceOrder.id}`);
    },
    [history]
  );

  return query.numero ? (
    <MaintServiceOrderDetailsPage
      hasCameFromDashboard={false}
      serviceOrderId={query.numero}
    />
  ) : (
    <ListFormPage
      actions={
        user?.hasPrivileges("service_orders_write_shop_floor") && [
          { label: "Abrir OS", onClick: handleCreateServiceOrderClick },
        ]
      }
      form={<MaintCreateServiceOrderForm />}
      formTitle="Abrir OS"
      list={
        <MaintServiceOrdersList
          cardRenderOptions={{
            hideUrgencyRibbon: !user?.hasPrivileges(
              "service_orders_write_shop_floor"
            ),
          }}
          data={listData}
          onSelectOrder={handleOrderSelect}
        />
      }
      listTitle={
        user?.hasPrivileges("service_orders_write_shop_floor")
          ? "Suas OS"
          : "Todas as OS"
      }
      title="Manutenção • Ordens de Serviço"
    />
  );
}
