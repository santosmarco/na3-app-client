import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3User,
  Na3UserEventData,
  Na3UserEventType,
} from "@modules/na3-types";
import { NA3_USER_EVENT_CATEGORY_MAP } from "@modules/na3-types";
import { getAuth, signOut, updatePassword } from "firebase/auth";
import type { CollectionReference } from "firebase/firestore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

import type {
  AppUserAttributes,
  AppUserAuthOnlyMethods,
  FirebaseNullOperationResult,
} from "../../types";
import { buildNa3Error, timestamp } from "../../utils";

type UserAuthOnlyMethodDeps = {
  fbCollectionRef: CollectionReference;
  onRedirect: () => void;
};

function createRegisterEventsMethod(
  baseAppUser: AppUserAttributes,
  { fbCollectionRef }: UserAuthOnlyMethodDeps
): AppUserAuthOnlyMethods["registerEvents"] {
  const { uid } = baseAppUser;

  return async <T extends Na3UserEventType>(events: {
    [Type in T]: Na3UserEventData<Type>;
  }): Promise<FirebaseNullOperationResult> => {
    try {
      const now = timestamp();

      const eventsArr = Object.entries<Na3UserEventData<T>>(events).map(
        ([t, data]) => {
          const type = t as T;
          return {
            data: data,
            eventId: nanoid(),
            fromUid: uid,
            timestamp: now,
            type: type,
            category: NA3_USER_EVENT_CATEGORY_MAP[type],
          };
        }
      );

      await updateDoc(doc(fbCollectionRef, uid), {
        activityHistory: arrayUnion(...eventsArr),
      });

      return { error: null };
    } catch (err) {
      return {
        error: translateFirebaseError(err as FirebaseError),
      };
    }
  };
}

function createUpdatePasswordMethod({
  fbCollectionRef,
  onRedirect,
}: UserAuthOnlyMethodDeps): AppUserAuthOnlyMethods["updatePassword"] {
  return async (
    newPassword: string
  ): Promise<
    | { error: FirebaseError; warning: null }
    | { error: null; warning: { message: string; title: string } }
    | { error: null; warning: null }
  > => {
    try {
      const firebaseAppUser = getAuth().currentUser;

      if (!firebaseAppUser) {
        return {
          error: buildNa3Error("na3/user/update-password/not-signed-in"),
          warning: null,
        };
      }

      await updatePassword(firebaseAppUser, newPassword);

      const updatedUser: Pick<Na3User, "isPasswordDefault"> = {
        isPasswordDefault: false,
      };

      await updateDoc(doc(fbCollectionRef, firebaseAppUser.uid), updatedUser);

      return { error: null, warning: null };
    } catch (err) {
      const firebaseError = err as FirebaseError;

      if (firebaseError.code === "auth/requires-recent-login") {
        await signOut(getAuth());
        onRedirect();

        return {
          error: null,
          warning: {
            title: "Reautenticação requerida",
            message: "Por favor, entre novamente para continuar.",
          },
        };
      }

      return {
        error: translateFirebaseError(err as FirebaseError),
        warning: null,
      };
    }
  };
}

export function buildAppUserAuthOnlyMethods(
  baseAppUser: AppUserAttributes,
  dependencies: UserAuthOnlyMethodDeps
): AppUserAuthOnlyMethods {
  return {
    updatePassword: createUpdatePasswordMethod(dependencies),
    registerEvents: createRegisterEventsMethod(baseAppUser, dependencies),
  };
}
