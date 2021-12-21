import type { TypedUseSelectorHook } from "react-redux";
import { useSelector as useOriginalSelector } from "react-redux";

import type { RootState } from "../types";

export const useSelector: TypedUseSelectorHook<RootState> = useOriginalSelector;
