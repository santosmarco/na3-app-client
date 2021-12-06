import type { Na3UserEventCategory, Na3UserEventType } from "../na3";

export const NA3_USER_EVENT_CATEGORY_MAP: Record<
  Na3UserEventType,
  Na3UserEventCategory
> = {
  SERVICE_ORDER_ACCEPT_SOLUTION: "service_order_operator",
  SERVICE_ORDER_CREATE: "service_order_operator",
  SERVICE_ORDER_REJECT_SOLUTION: "service_order_operator",
  SERVICE_ORDER_CONFIRM: "service_order_maintenance",
  SERVICE_ORDER_DELIVER: "service_order_maintenance",
  USER_SET_BIO: "user_profile",
  DOCS_STD_CREATE: "docs_std_manager",
};
