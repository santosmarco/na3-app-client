import type {
  ServiceOrdersSetDataAction,
  ServiceOrdersSetErrorAction,
  ServiceOrdersSetLoadingAction,
  ServiceOrdersState,
} from "../../types";

export const setServiceOrdersData = (
  data: ServiceOrdersState["data"]
): ServiceOrdersSetDataAction => ({
  data,
  type: "SERVICE_ORDERS_SET_DATA",
});

export const setServiceOrdersLoading = (
  loading: ServiceOrdersState["loading"]
): ServiceOrdersSetLoadingAction => ({
  loading,
  type: "SERVICE_ORDERS_SET_LOADING",
});

export const setServiceOrdersError = (
  error: ServiceOrdersState["error"]
): ServiceOrdersSetErrorAction => ({
  error,
  type: "SERVICE_ORDERS_SET_ERROR",
});
