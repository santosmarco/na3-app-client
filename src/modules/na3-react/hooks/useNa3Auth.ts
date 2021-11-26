import dayjs from "dayjs";
import firebase from "firebase";
import { useCallback, useRef } from "react";

import type { FirebaseError } from "../../firebase-errors-pt-br";
import { translateFirebaseError } from "../../firebase-errors-pt-br";
import type { Na3User } from "../../na3-types";
import { formatRegistrationId, getAuthEmail } from "../helpers";
import type { AppUser, AuthState } from "../types";
import {
  buildNa3Error,
  pickRandomColorCombination,
  resolveCollectionId,
} from "../utils";
import { useCurrentUser } from "./useCurrentUser";
import { useStateSlice } from "./useStateSlice";

export type UseNa3AuthResult = {
  error: AuthState["error"];
  helpers: {
    signIn: (
      registrationId: string,
      password: string
    ) => Promise<
      | { error: FirebaseError; user: null }
      | { error: null; user: firebase.auth.UserCredential }
    >;
    signOut: () => Promise<{ error: FirebaseError } | { error: null }>;
    signUp: (
      registrationId: string,
      userConfig: Pick<
        Na3User,
        "email" | "firstName" | "lastName" | "middleName" | "positionIds"
      >
    ) => Promise<
      { error: FirebaseError; user: null } | { error: null; user: Na3User }
    >;
  };
  loading: boolean;
  user: AppUser | undefined;
};

export function useNa3Auth(): UseNa3AuthResult {
  const { environment } = useStateSlice("config");
  const { error, loading } = useStateSlice("auth");

  const user = useCurrentUser();

  const usersCollectionRef = useRef(
    firebase.firestore().collection(
      resolveCollectionId("NA3-USERS", environment, {
        forceProduction: true,
      })
    )
  );

  const signIn = useCallback(
    async (
      registrationId: string,
      password: string
    ): Promise<
      | { error: FirebaseError; user: null }
      | { error: null; user: firebase.auth.UserCredential }
    > => {
      try {
        const user = await firebase
          .auth()
          .signInWithEmailAndPassword(getAuthEmail(registrationId), password);
        return { error: null, user };
      } catch (err) {
        return {
          error: translateFirebaseError(err as FirebaseError),
          user: null,
        };
      }
    },
    []
  );

  const signOut = useCallback(async (): Promise<
    { error: FirebaseError } | { error: null }
  > => {
    try {
      await firebase.auth().signOut();
      return { error: null };
    } catch (err) {
      return {
        error: translateFirebaseError(err as FirebaseError),
      };
    }
  }, []);

  const signUp = useCallback(
    async (
      registrationId: string,
      userConfig: Pick<
        Na3User,
        "email" | "firstName" | "lastName" | "middleName" | "positionIds"
      >
    ): Promise<
      { error: FirebaseError; user: null } | { error: null; user: Na3User }
    > => {
      const formattedRegId = formatRegistrationId(registrationId);

      try {
        const userCandidates = await usersCollectionRef.current
          .where("registrationId", "==", formattedRegId)
          .get();

        if (!userCandidates.empty) {
          return {
            error: buildNa3Error("na3/auth/sign-up/user-already-exists"),
            user: null,
          };
        }

        const timestamp = dayjs().format();
        const colors = pickRandomColorCombination();
        const user: Omit<Na3User, "id"> = {
          activityHistory: [],
          createdAt: timestamp,
          displayName: `${userConfig.firstName} ${userConfig.lastName}`,
          email: userConfig.email || null,
          firstName: userConfig.firstName,
          isActive: true,
          isEmailVerified: false,
          isSuper: false,
          lastName: userConfig.lastName,
          middleName: userConfig.middleName || null,
          notificationTokens: [],
          photoUrl: null,
          positionIds: userConfig.positionIds,
          registrationId: formattedRegId,
          style: { backgroundColor: colors[0], color: colors[1] },
          updatedAt: timestamp,
          isPasswordDefault: true,
          lastSeenAt: timestamp,
          bio: null,
        };

        const credentials = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            getAuthEmail(formattedRegId),
            `novaa3-${formattedRegId}`
          );

        if (!credentials.user) {
          return {
            error: buildNa3Error("na3/auth/sign-up/user-not-created"),
            user: null,
          };
        }

        await usersCollectionRef.current.doc(credentials.user.uid).set(user);

        await signOut();

        return { error: null, user: { ...user, id: credentials.user.uid } };
      } catch (err) {
        return {
          error: translateFirebaseError(err as FirebaseError),
          user: null,
        };
      }
    },
    [signOut]
  );

  return {
    error: error,
    helpers: { signIn, signOut, signUp },
    loading: loading,
    user: user,
  };
}
