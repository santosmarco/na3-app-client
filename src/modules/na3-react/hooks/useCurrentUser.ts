import type { AppUserAuthenticated } from "../types";
import { useNa3Users } from "./useNa3Users";

export function useCurrentUser(): AppUserAuthenticated | undefined {
  const { currentUser } = useNa3Users();

  return currentUser;
}
