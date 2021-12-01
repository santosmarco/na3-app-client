import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3User,
  Na3UserEvent,
  Na3UserEventData,
  Na3UserEventType,
} from "@modules/na3-types";
import { NA3_USER_EVENT_CATEGORY_MAP } from "@modules/na3-types";
import firebase from "firebase";
import { nanoid } from "nanoid";

import type {
  AppUserAttributes,
  AppUserAuthOnlyMethods,
  FirebaseOperationResult,
} from "../../types";
import { buildNa3Error, timestamp } from "../../utils";

type UserAuthOnlyMethodDeps = {
  fbCollectionRef: firebase.firestore.CollectionReference;
  onRedirect: () => void;
};

function createRegisterEventsMethod(
  baseAppUser: AppUserAttributes,
  { fbCollectionRef }: UserAuthOnlyMethodDeps
): AppUserAuthOnlyMethods["registerEvents"] {
  const { uid } = baseAppUser;

  return async <T extends Na3UserEventType>(events: {
    [Type in T]: Na3UserEventData<Type>;
  }): Promise<
    FirebaseOperationResult<Na3UserEvent<T, Na3UserEventData<T>>[]>
  > => {
    try {
      const now = timestamp();

      const eventsArr: Na3UserEvent<T, Na3UserEventData<T>>[] = Object.entries<
        Na3UserEventData<T>
      >(events).map(([t, data]) => {
        const type = t as T;
        return {
          data,
          eventId: nanoid(),
          fromUid: uid,
          timestamp: now,
          type: type,
          category: NA3_USER_EVENT_CATEGORY_MAP[type] || "uncategorized",
        };
      });

      await fbCollectionRef.doc(uid).update({
        activityHistory: firebase.firestore.FieldValue.arrayUnion(...eventsArr),
      });

      return { error: null, data: eventsArr };
    } catch (err) {
      return {
        error: translateFirebaseError(err as FirebaseError),
        data: null,
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
      const firebaseAppUser = firebase.auth().currentUser;

      if (!firebaseAppUser) {
        return {
          error: buildNa3Error("na3/user/update-password/not-signed-in"),
          warning: null,
        };
      }

      await firebaseAppUser.updatePassword(newPassword);

      const updatedUser: Pick<Na3User, "isPasswordDefault"> = {
        isPasswordDefault: false,
      };

      await fbCollectionRef.doc(firebaseAppUser.uid).update(updatedUser);

      return { error: null, warning: null };
    } catch (err) {
      const firebaseError = err as FirebaseError;

      if (firebaseError.code === "auth/requires-recent-login") {
        await firebase.auth().signOut();
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
