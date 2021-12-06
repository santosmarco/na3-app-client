import type { Na3ServiceOrderPriority } from "../maintenance/Na3ServiceOrder";

/* Map event types to their data and categories */
type Na3UserEventMap = {
  DOCS_STD_CREATE: {
    category: "docs_std_manager";
    data: { docId: string };
  };
  SERVICE_ORDER_ACCEPT_SOLUTION: {
    category: "service_order_operator";
    data: { id: string; msFromDeliver: number | null };
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
  SERVICE_ORDER_DELIVER: {
    category: "service_order_maintenance";
    data: { id: string; msFromCreation: number | null };
  };
  SERVICE_ORDER_REJECT_SOLUTION: {
    category: "service_order_operator";
    data: { id: string; refusalReason: string };
  };
  USER_SET_BIO: {
    category: "user_profile";
    data: { bio: string };
  };
};

export type Na3UserEventType = keyof Na3UserEventMap;

export type Na3UserEventCategory<
  Type extends Na3UserEventType = Na3UserEventType
> = Na3UserEventMap[Type]["category"] | "uncategorized";

export type Na3UserEventData<Type extends Na3UserEventType = Na3UserEventType> =
  Na3UserEventMap[Type]["data"];

export type Na3UserEvent<Type extends Na3UserEventType = Na3UserEventType> = {
  readonly category: Na3UserEventCategory<Type>;
  readonly eventId: string;
  readonly fromUid: string;
  readonly timestamp: string;
} & (
  | {
      data: Na3UserEventMap["SERVICE_ORDER_ACCEPT_SOLUTION"]["data"];
      readonly type: "SERVICE_ORDER_ACCEPT_SOLUTION";
    }
  | {
      data: Na3UserEventMap["SERVICE_ORDER_CONFIRM"]["data"];
      readonly type: "SERVICE_ORDER_CONFIRM";
    }
  | {
      data: Na3UserEventMap["SERVICE_ORDER_CREATE"]["data"];
      readonly type: "SERVICE_ORDER_CREATE";
    }
  | {
      data: Na3UserEventMap["SERVICE_ORDER_DELIVER"]["data"];
      readonly type: "SERVICE_ORDER_DELIVER";
    }
  | {
      data: Na3UserEventMap["SERVICE_ORDER_REJECT_SOLUTION"]["data"];
      readonly type: "SERVICE_ORDER_REJECT_SOLUTION";
    }
  | {
      data: Na3UserEventMap["USER_SET_BIO"]["data"];
      readonly type: "USER_SET_BIO";
    }
);
