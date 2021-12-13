import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type { Na3User } from "@modules/na3-types";
import type { UserCredential } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut as signOutFromFirebase,
} from "firebase/auth";
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useCallback, useRef } from "react";

import type { AppUserAuthenticated, AuthState } from "../types";
import {
  buildNa3Error,
  createRandomUserStyle,
  getCollection,
  timestamp,
} from "../utils";
import { useNa3Users } from "./useNa3Users";
import { useStateSlice } from "./useStateSlice";

export type UseNa3AuthResult = {
  currentUser: AppUserAuthenticated | undefined;
  error: AuthState["error"];
  helpers: {
    signIn: (
      registrationId: string,
      password: string
    ) => Promise<
      | { error: FirebaseError; user: null }
      | { error: null; user: UserCredential }
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
};

export function useNa3Auth(): UseNa3AuthResult {
  const { environment } = useStateSlice("config");
  const { error, loading } = useStateSlice("auth");

  const {
    helpers: { formatRegistrationId, getAuthEmail },
    currentUser,
  } = useNa3Users();

  const usersCollectionRef = useRef(getCollection("users", environment));

  const signIn = useCallback(
    async (
      registrationId: string,
      password: string
    ): Promise<
      | { error: FirebaseError; user: null }
      | { error: null; user: UserCredential }
    > => {
      try {
        const user = await signInWithEmailAndPassword(
          getAuth(),
          getAuthEmail(registrationId),
          password
        );
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

  const signOut = useCallback(async (): Promise<
    { error: FirebaseError } | { error: null }
  > => {
    try {
      await signOutFromFirebase(getAuth());
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
        const userCandidates = await getDocs(
          query(
            usersCollectionRef.current,
            where("registrationId", "==", formattedRegId)
          )
        );

        if (!userCandidates.empty) {
          return {
            error: buildNa3Error("na3/auth/sign-up/user-already-exists"),
            user: null,
          };
        }

        const now = timestamp();
        const user: Omit<Na3User, "uid"> = {
          activityHistory: [],
          createdAt: now,
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
          style: createRandomUserStyle(),
          updatedAt: now,
          isPasswordDefault: true,
          lastSeenAt: now,
          bio: null,
        };

        const credentials = await createUserWithEmailAndPassword(
          getAuth(),
          getAuthEmail(formattedRegId),
          `novaa3-${formattedRegId}`
        );

        await setDoc(
          doc(usersCollectionRef.current, credentials.user.uid),
          user
        );

        void signOut();

        return { error: null, user: { ...user, uid: credentials.user.uid } };
      } catch (err) {
        return {
          error: translateFirebaseError(err as FirebaseError),
          user: null,
        };
      }
    },
    [formatRegistrationId, getAuthEmail, signOut]
  );

  return {
    error: error,
    helpers: { signIn, signOut, signUp },
    loading: loading,
    currentUser,
  };
}
