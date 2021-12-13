import type { Na3AppDevice } from "@modules/na3-types";

import { useStateSlice } from "./useStateSlice";

type UseDeviceResult = Na3AppDevice;

export function useDevice(): UseDeviceResult {
  return useStateSlice("global").device;
}
