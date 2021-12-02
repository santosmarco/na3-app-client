import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type { Na3User } from "@modules/na3-types";
import firebase from "firebase";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import useLocalStorage from "react-use-localstorage";

import { useStateSlice } from "../../../hooks";
import {
  setAuthError,
  setAuthFirebaseUser,
  setAuthLoading,
  setAuthUser,
} from "../../../store/actions";
import { resolveCollectionId, timestamp } from "../../../utils";

export function Na3AuthController(): null {
  const { environment, messagingTokensStorageKey } = useStateSlice("config");
  const { user } = useStateSlice("auth");

  const dispatch = useDispatch();

  const [storedMessagingTokens, setStoredMessagingTokens] = useLocalStorage(
    messagingTokensStorageKey,
    "[]"
  );

  const usersCollectionRef = useRef(
    firebase.firestore().collection(resolveCollectionId("users", environment))
  );

  useEffect(() => {
    let unsubscribeFromUserChanges: (() => void) | undefined = undefined;

    const unsubscribeFromAuthStateChanges = firebase
      .auth()
      .onAuthStateChanged(async (fbUser) => {
        if (!fbUser) {
          // Signed out.
          dispatch(setAuthFirebaseUser(null));
          dispatch(setAuthUser(null));
          dispatch(setAuthLoading(false));
          dispatch(setAuthError(null));
        } else {
          // Set auth's _firebaseUser.
          dispatch(setAuthFirebaseUser(fbUser));
          // Set auth's loading to true. We will start fetching the user.
          dispatch(setAuthLoading(true));

          // The user's Firestore reference based on its uid.
          const userRef = usersCollectionRef.current.doc(fbUser.uid);

          try {
            const userSnapshot = await userRef.get();
            const user: Na3User = {
              ...(userSnapshot.data() as Omit<Na3User, "uid">),
              uid: userSnapshot.id,
            };

            // Set auth's user.
            dispatch(setAuthUser(user));

            // Subscribe to changes in the user's data.
            unsubscribeFromUserChanges = userRef.onSnapshot(
              (updatedUserSnapshot) => {
                const updatedUser: Na3User = {
                  ...(updatedUserSnapshot.data() as Omit<Na3User, "uid">),
                  uid: updatedUserSnapshot.id,
                };
                // Update auth's user.
                dispatch(setAuthUser(updatedUser));
              }
            );

            // Update user's lastSeenAt field.
            const updatedUserLastSeenAt: Pick<Na3User, "lastSeenAt"> = {
              lastSeenAt: timestamp(),
            };
            void userRef.update(updatedUserLastSeenAt);
          } catch (err) {
            dispatch(setAuthError(err as FirebaseError));
          } finally {
            dispatch(setAuthLoading(false));
          }
        }
      });

    return (): void => {
      unsubscribeFromAuthStateChanges();
      unsubscribeFromUserChanges?.();
    };
  }, [dispatch]);

  // Handle updates to the user's notification tokens.
  useEffect(() => {
    const parsedTokens = JSON.parse(storedMessagingTokens) as string[];
    // If there's a user and some tokens
    if (user && parsedTokens.length > 0) {
      // The user's Firestore reference based on its uid.
      const userRef = usersCollectionRef.current.doc(user.uid);
      // Update the user's tokens.
      void userRef.update({
        notificationTokens: firebase.firestore.FieldValue.arrayUnion(
          ...parsedTokens
        ),
      });
      // Clear all locally-stored tokens.
      setStoredMessagingTokens("[]");
    }
  }, [user, storedMessagingTokens, setStoredMessagingTokens]);

  return null;
}
