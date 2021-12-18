import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import translateFirebaseError from "@modules/firebase-errors-pt-br";
import type { Na3User } from "@modules/na3-types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
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
import { getCollection, timestamp } from "../../../utils";

export function Na3AuthController(): null {
  const { environment, messagingTokensStorageKey } = useStateSlice("config");
  const { user } = useStateSlice("auth");

  const dispatch = useDispatch();

  const [storedMessagingTokens, setStoredMessagingTokens] = useLocalStorage(
    messagingTokensStorageKey,
    "[]"
  );

  const usersCollectionRef = useRef(getCollection("users", environment));

  useEffect(() => {
    let unsubscribeFromUserChanges: (() => void) | undefined = undefined;

    const unsubscribeFromAuthStateChanges = onAuthStateChanged(
      getAuth(),
      (fbUser) => {
        void (async (): Promise<void> => {
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
            const userRef = doc(usersCollectionRef.current, fbUser.uid);

            try {
              const userSnapshot = await getDoc(userRef);
              const userData = userSnapshot.data();

              if (!userData) {
                // TODO: Handle user not found error
                return;
              }

              const user: Na3User = { ...userData, uid: userSnapshot.id };

              // Set auth's user.
              dispatch(setAuthUser(user));

              // Subscribe to changes in the user's data.
              unsubscribeFromUserChanges = onSnapshot(
                userRef,
                (updatedUserSnapshot) => {
                  const updatedUserData = updatedUserSnapshot.data();

                  if (!updatedUserData) {
                    // TODO: Handle user not found error
                    return;
                  }

                  const updatedUser: Na3User = {
                    ...updatedUserData,
                    uid: updatedUserSnapshot.id,
                  };

                  // Update auth's user.
                  dispatch(setAuthUser(updatedUser));
                }
              );

              // Update user's lastSeenAt field.
              void updateDoc(userRef, { lastSeenAt: timestamp() });
            } catch (err) {
              dispatch(
                setAuthError(translateFirebaseError(err as FirebaseError))
              );
            } finally {
              dispatch(setAuthLoading(false));
            }
          }
        })();
      }
    );

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
      const userRef = doc(usersCollectionRef.current, user.uid);
      // Update the user's tokens.
      void updateDoc(userRef, {
        notificationTokens: arrayUnion(...parsedTokens),
      });
      // Clear all locally-stored tokens.
      setStoredMessagingTokens("[]");
    }
  }, [user, storedMessagingTokens, setStoredMessagingTokens]);

  return null;
}
