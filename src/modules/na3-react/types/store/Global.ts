import type { Na3AppDevice } from "../../../na3-types";

export type GlobalState = {
  device: Na3AppDevice;
  loading: boolean;
};

export type GlobalSetLoadingAction = {
  loading: GlobalState["loading"];
  type: "GLOBAL_SET_LOADING";
};

export type GlobalSetDeviceAction = {
  device: GlobalState["device"];
  type: "GLOBAL_SET_DEVICE";
};

export type GlobalAction = GlobalSetDeviceAction | GlobalSetLoadingAction;
