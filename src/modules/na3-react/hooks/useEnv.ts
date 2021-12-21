import type { ConfigEnvironment } from "../types";
import { useSelector } from "./useSelector";

export function useEnv(): ConfigEnvironment {
  return useSelector((state) => state.config.environment);
}
