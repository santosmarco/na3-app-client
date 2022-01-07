import { List } from "@components";
import { useNa3ServiceOrders } from "@modules/na3-react";
import type { Na3ServiceOrder } from "@modules/na3-types";
import { Badge } from "antd";
import React, { useCallback } from "react";

import { MaintServiceOrderCard } from "./card/MaintServiceOrderCard";

export type MaintServiceOrderCardRenderOptions = {
  hideStatus?: boolean;
  hideUrgencyRibbon?: boolean;
  showDepartment?: boolean;
  showMachine?: boolean;
};

type MaintServiceOrdersListProps = {
  cardRenderOptions?: MaintServiceOrderCardRenderOptions;
  data: Na3ServiceOrder[];
  isSearchDisabled?: boolean;
  onSelectOrder: ((serviceOrder: Na3ServiceOrder) => void) | null;
};

export function MaintServiceOrdersList({
  data,
  onSelectOrder,
  isSearchDisabled,
  cardRenderOptions,
}: MaintServiceOrdersListProps): JSX.Element {
  const serviceOrders = useNa3ServiceOrders();

  const handleRenderItem = useCallback(
    (order: Na3ServiceOrder) => {
      const card = (
        <MaintServiceOrderCard
          data={order}
          isStatusHidden={cardRenderOptions?.hideStatus}
          onSelect={onSelectOrder}
          showDepartment={cardRenderOptions?.showDepartment}
          showMachine={cardRenderOptions?.showMachine}
        />
      );

      if (
        serviceOrders.helpers.orderRequiresAction(order) &&
        !cardRenderOptions?.hideUrgencyRibbon
      ) {
        return (
          <Badge.Ribbon color="red" text="Ação necessária">
            {card}
          </Badge.Ribbon>
        );
      }
      return card;
    },
    [
      onSelectOrder,
      serviceOrders.helpers,
      cardRenderOptions?.hideStatus,
      cardRenderOptions?.hideUrgencyRibbon,
      cardRenderOptions?.showDepartment,
      cardRenderOptions?.showMachine,
    ]
  );

  const handleFilterItemOnSearch = useCallback(
    (query: string): Na3ServiceOrder[] =>
      data.filter((order) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          order.description.toLowerCase().includes(formattedQuery) ||
          order.dpt.toLowerCase().includes(formattedQuery) ||
          parseInt(order.id) === parseInt(query)
        );
      }),
    [data]
  );

  return (
    <List
      data={data}
      error={serviceOrders.error?.message}
      filterItem={isSearchDisabled ? undefined : handleFilterItemOnSearch}
      isLoading={serviceOrders.loading}
      renderItem={handleRenderItem}
      verticalSpacing={8}
    />
  );
}
