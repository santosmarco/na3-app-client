import type { Na3User } from "@modules/na3-types";
import firebase from "firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import useLocalStorage from "react-use-localstorage";

import { useNa3Users, useStateSlice } from "../../../hooks";
import {
  setAuthError,
  setAuthFirebaseUser,
  setAuthLoading,
  setAuthUser,
} from "../../../store/actions";
import { resolveCollectionId, timestamp } from "../../../utils";

export function Na3AuthController(): null {
  const { environment, messagingTokensStorageKey } = useStateSlice("config");

  const dispatch = useDispatch();
  const [storedMessagingTokens, setStoredMessagingTokens] = useLocalStorage(
    messagingTokensStorageKey,
    "[]"
  );

  const [didUpdateLastSeen, setDidUpdateLastSeen] = useState(false);

  const {
    helpers: { extractRegistrationIdFromEmail },
  } = useNa3Users();

  const [fbUser, fbUserLoading, fbUserError] = useAuthState(firebase.auth());
  const [na3UserCandidates, na3UserCandidatesLoading, na3UserCandidatesError] =
    useCollectionData<Omit<Na3User, "uid">, "uid", "ref">(
      firebase
        .firestore()
        .collection(resolveCollectionId("users", environment))
        .where(
          "registrationId",
          "==",
          extractRegistrationIdFromEmail(fbUser?.email) || null
        ),
      { idField: "uid", refField: "ref" }
    );

  /* Auth state management hooks */

  useEffect(() => {
    dispatch(setAuthFirebaseUser(fbUser));
  }, [dispatch, fbUser]);

  useEffect(() => {
    dispatch(setAuthLoading(fbUserLoading || na3UserCandidatesLoading));
  }, [dispatch, fbUserLoading, na3UserCandidatesLoading]);

  useEffect(() => {
    dispatch(setAuthError(fbUserError || na3UserCandidatesError || null));
  }, [dispatch, fbUserError, na3UserCandidatesError]);

  useEffect(() => {
    dispatch(setAuthUser(na3UserCandidates?.[0] || null));
  }, [dispatch, na3UserCandidates]);

  /* Update user's push notification tokens */

  useEffect(() => {
    const parsedTokens = JSON.parse(storedMessagingTokens) as Array<string>;
    if (na3UserCandidates?.[0] && parsedTokens.length > 0) {
      void na3UserCandidates[0].ref.update({
        notificationTokens: firebase.firestore.FieldValue.arrayUnion(
          ...parsedTokens
        ),
      });
      setStoredMessagingTokens("[]");
    }
  }, [na3UserCandidates, storedMessagingTokens, setStoredMessagingTokens]);

  /* Update user's lastSeenAt field */

  useEffect(() => {
    if (na3UserCandidates?.[0] && !didUpdateLastSeen) {
      const updatedUser: Pick<Na3User, "lastSeenAt"> = {
        lastSeenAt: timestamp(),
      };
      void na3UserCandidates[0].ref.update(updatedUser);
      setDidUpdateLastSeen(true);
    }
  }, [na3UserCandidates, didUpdateLastSeen]);

  return null;
}
