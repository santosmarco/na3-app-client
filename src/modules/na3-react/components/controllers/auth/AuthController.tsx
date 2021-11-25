import firebase from "firebase";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import type { FirebaseError } from "../../../../firebase-errors-pt-br";
import type { Na3User } from "../../../../na3-types";
import { useStateSlice } from "../../../hooks";
import {
  setAuthError,
  setAuthLoading,
  setAuthUser,
} from "../../../store/actions";
import type { Na3Error } from "../../../utils";
import { buildNa3Error, resolveCollectionId } from "../../../utils";

export function Na3AuthController(): null {
  const { environment } = useStateSlice("config");

  const dispatch = useDispatch();

  const usersCollectionRef = useMemo(
    () =>
      firebase.firestore().collection(
        resolveCollectionId("NA3-USERS", environment, {
          forceProduction: true,
        })
      ),
    [environment]
  );

  const handleSignIn = useCallback(
    (user: Na3User) => {
      dispatch(setAuthUser(user));
      dispatch(setAuthError(null));
      dispatch(setAuthLoading(false));
    },
    [dispatch]
  );

  const handleSignOut = useCallback(
    (error?: FirebaseError | Na3Error, shouldFirebaseSignOut?: boolean) => {
      dispatch(setAuthUser(null));
      dispatch(setAuthError(error || null));
      dispatch(setAuthLoading(false));

      if (shouldFirebaseSignOut) {
        void firebase.auth().signOut();
      }
    },
    [dispatch]
  );

  const handleAuthError = useCallback(
    (error: FirebaseError | Na3Error) => {
      handleSignOut(error, true);
    },
    [handleSignOut]
  );

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
          handleSignOut();
          return;
        }

        const { email } = firebaseUser;

        const registrationId = email?.split("@")[0];

        try {
          const { docs: userCandidates } = await usersCollectionRef
            .where("registrationId", "==", registrationId)
            .get();

          if (userCandidates.length !== 1) {
            if (userCandidates.length === 0) {
              handleAuthError(
                buildNa3Error("na3/auth/state-change/user-not-found")
              );
            } else if (userCandidates.length > 1) {
              handleAuthError(
                buildNa3Error("na3/auth/state-change/user-duplicate")
              );
            }
            return;
          }

          const user: Na3User = {
            id: userCandidates[0].id,
            ...(userCandidates[0].data() as Omit<Na3User, "id">),
          };

          handleSignIn(user);
        } catch (err) {
          handleAuthError(err as FirebaseError);
        }
      });

    return (): void => {
      unsubscribe();
    };
  }, [usersCollectionRef, handleSignIn, handleSignOut, handleAuthError]);

  return null;
}
