import { Badge } from "antd";
import React, { useCallback } from "react";

import { useNa3ServiceOrders } from "../../../../modules/na3-react";
import type { Na3ServiceOrder } from "../../../../modules/na3-types";
import { List } from "../../../lists/List";
import { MaintServiceOrderCard } from "./card/MaintServiceOrderCard";

type MaintServiceOrdersListProps = {
  cardRenderOptions?: {
    hideStatus?: boolean;
    hideUrgencyRibbon?: boolean;
  };
  data: Na3ServiceOrder[];
  isSearchDisabled?: boolean;
  onSelectOrder: ((serviceOrder: Na3ServiceOrder) => void) | null;
};

const defaultProps = {
  cardRenderOptions: undefined,
  isSearchDisabled: false,
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
    ]
  );

  const handleFilterItemOnSearch = useCallback(
    (query: string): Na3ServiceOrder[] =>
      data?.filter((order) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          order.description.toLowerCase().includes(formattedQuery) ||
          parseInt(order.id) === parseInt(query)
        );
      }) || [],
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

MaintServiceOrdersList.defaultProps = defaultProps;
