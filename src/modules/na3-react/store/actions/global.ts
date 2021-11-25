import type {
  GlobalSetDeviceAction,
  GlobalSetLoadingAction,
  GlobalState,
} from "../../types";

export const setGlobalLoading = (
  loading: GlobalState["loading"]
): GlobalSetLoadingAction => ({ loading, type: "GLOBAL_SET_LOADING" });

export const setGlobalDevice = (
  device: GlobalState["device"]
): GlobalSetDeviceAction => ({ device, type: "GLOBAL_SET_DEVICE" });
