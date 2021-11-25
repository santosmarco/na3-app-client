import type { Na3User } from "@modules/na3-types";
import dayjs from "dayjs";
import firebase from "firebase";
import { useCallback, useRef } from "react";

import type { FirebaseError } from "../../firebase-errors-pt-br";
import { translateFirebaseError } from "../../firebase-errors-pt-br";
import type { AppUser } from "../types";
import { buildNa3Error, resolveCollectionId } from "../utils";
import { useNa3User } from "./useNa3User";
import { useStateSlice } from "./useStateSlice";

export type UseNa3AuthResult = {
  error: FirebaseError | null;
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

  const user = useNa3User();

  const usersCollectionRef = useRef(
    firebase.firestore().collection(
      resolveCollectionId("NA3-USERS", environment, {
        forceProduction: true,
      })
    )
  );

  const getAuthEmail = useCallback(
    (registrationId: string) =>
      `${parseInt(registrationId)
        .toString()
        .padStart(4, "0")}@novaa3-app.com.br`,
    []
  );

  const signUp = useCallback(
    async (
      registrationId: string,
      userConfig: Pick<
        Na3User,
        "email" | "firstName" | "lastName" | "middleName" | "positionIds"
      >
    ) => {
      const formattedRegId = registrationId.trim();

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
          style: { backgroundColor: null, color: null },
          updatedAt: timestamp,
        };

        const [, firestoreUser] = await Promise.all([
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              getAuthEmail(formattedRegId),
              `novaa3-${formattedRegId}`
            ),
          usersCollectionRef.current.add(user),
        ]);

        return { error: null, user: { ...user, id: firestoreUser.id } };
      } catch (err) {
        return {
          error: translateFirebaseError(err as FirebaseError),
          user: null,
        };
      }
    },
    [getAuthEmail]
  );

  const signIn = useCallback(
    async (registrationId: string, password: string) => {
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
    [getAuthEmail]
  );

  const signOut = useCallback(async () => {
    try {
      await firebase.auth().signOut();
      return { error: null };
    } catch (err) {
      return {
        error: translateFirebaseError(err as FirebaseError),
        user: null,
      };
    }
  }, []);

  return {
    error: error,
    helpers: { signIn, signOut, signUp },
    loading: loading,
    user: user,
  };
}
