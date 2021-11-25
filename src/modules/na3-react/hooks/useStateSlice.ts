import { useSelector } from "react-redux";

import type { RootState } from "../types";

export function useStateSlice<Slice extends keyof RootState>(
  slice: Slice
): RootState[Slice] {
  return useSelector<RootState, RootState[Slice]>((state) => state[slice]);
}
