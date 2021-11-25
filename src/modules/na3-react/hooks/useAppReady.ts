import { useStateSlice } from "./useStateSlice";

export function useAppReady(): boolean {
  const global = useStateSlice("global");

  return !global.loading;
}
