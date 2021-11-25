import type { Na3PeopleState } from "../../types";
import { useStateSlice } from "../useStateSlice";

type UseNa3PeopleResult = Na3PeopleState;

export function useNa3People(): UseNa3PeopleResult {
  const na3People = useStateSlice("na3People");

  return na3People;
}
