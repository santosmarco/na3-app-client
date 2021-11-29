import type { Na3User } from "@modules/na3-types";
import firebase from "firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { useNa3Users, useStateSlice } from "../../../hooks";
import {
  setAuthError,
  setAuthFirebaseUser,
  setAuthLoading,
  setAuthUser,
} from "../../../store/actions";
import { resolveCollectionId, timestamp } from "../../../utils";

export function Na3AuthController(): null {
  const { environment } = useStateSlice("config");

  const [didUpdateLastSeen, setDidUpdateLastSeen] = useState(false);

  const {
    helpers: { extractRegistrationIdFromEmail },
  } = useNa3Users();

  const dispatch = useDispatch();

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
