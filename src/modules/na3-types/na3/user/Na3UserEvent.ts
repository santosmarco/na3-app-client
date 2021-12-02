import type { Na3ServiceOrderPriority } from "../maintenance/Na3ServiceOrder";

/* Map event types to their data and category */
type Na3UserEventMap = {
  SERVICE_ORDER_ACCEPT_SOLUTION: {
    category: "service_order_operator";
    data: { id: string };
  };
  SERVICE_ORDER_CONFIRM: {
    category: "service_order_maintenance";
    data: {
      assigneeUid: string;
      id: string;
      priority: Na3ServiceOrderPriority;
    };
  };
  SERVICE_ORDER_CREATE: {
    category: "service_order_operator";
    data: { id: string };
  };
  SERVICE_ORDER_REJECT_SOLUTION: {
    category: "service_order_operator";
    data: { id: string; refusalReason: string };
  };
  SERVICE_ORDER_SOLVE: {
    category: "service_order_maintenance";
    data: { id: string };
  };
};

export type Na3UserEventType = keyof Na3UserEventMap;

export type Na3UserEventCategory<
  Type extends Na3UserEventType = Na3UserEventType
> = Na3UserEventMap[Type]["category"] | "uncategorized";

export type Na3UserEventData<Type extends Na3UserEventType = Na3UserEventType> =
  Na3UserEventMap[Type]["data"];

export type Na3UserEvent<
  Type extends Na3UserEventType = Na3UserEventType,
  Data extends Na3UserEventData<Type> = Na3UserEventData
> = {
  readonly category: Na3UserEventCategory<Type>;
  readonly data: Data;
  readonly eventId: string;
  readonly fromUid: string;
  readonly timestamp: string;
  readonly type: Type;
};
