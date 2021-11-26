import { useCallback } from "react";

import type { FirebaseError } from "../../firebase-errors-pt-br";
import type { Na3User } from "../../na3-types";
import { formatRegistrationId } from "../helpers";
import { useStateSlice } from "./useStateSlice";

export type UseNa3UsersResult = {
  data: Na3User[] | null;
  error: FirebaseError | null;
  helpers: {
    getByRegistrationId: (registrationId: string) => Na3User | undefined;
  };
  loading: boolean;
};

export function useNa3Users(): UseNa3UsersResult {
  const users = useStateSlice("na3Users");

  const getByRegistrationId = useCallback(
    (registrationId: string): Na3User | undefined => {
      return users.data?.find(
        (user) => user.registrationId === formatRegistrationId(registrationId)
      );
    },
    [users.data]
  );

  return { ...users, helpers: { getByRegistrationId } };
}
