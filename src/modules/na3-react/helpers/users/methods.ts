import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3User,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import firebase from "firebase";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

import type {
  AppUserAttributes,
  AppUserAuthOnlyMethods,
  AppUserMethods,
} from "../../types";
import { buildNa3Error } from "../../utils";

type UserAuthOnlyMethodDeps = {
  fbCollectionRef: firebase.firestore.CollectionReference;
  onRedirect: () => void;
};

function createGetDepartmentsByTypeMethod(
  baseAppUser: AppUserAttributes
): AppUserMethods["getDepartmentsByType"] {
  return <T extends Na3DepartmentType>(
    departmentType: T
  ): Na3Department<T>[] => {
    return baseAppUser.departments.filter(
      (dpt): dpt is Na3Department<T> => dpt.type === departmentType
    );
  };
}

function createHasPrivilegesMethod(
  baseAppUser: AppUserAttributes
): AppUserMethods["hasPrivileges"] {
  return (
    privileges: Na3UserPrivilegeId | Na3UserPrivilegeId[],
    options?: { every?: boolean }
  ): boolean => {
    if (baseAppUser.isSuper || baseAppUser.privileges.includes("_super")) {
      return true;
    }

    const privArr = typeof privileges === "string" ? [privileges] : privileges;

    return privArr[options?.every ? "every" : "some"]((priv) =>
      baseAppUser.privileges.includes(priv)
    );
  };
}

function createIncludesDepartmentsMethod(
  baseAppUser: AppUserAttributes
): AppUserMethods["includesDepartments"] {
  return (
    query:
      | Falsy
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>[]
  ): boolean => {
    const queryArr = typeof query === "string" ? [query] : query;

    return (queryArr || []).some((query) =>
      baseAppUser.departments.find(
        (dpt) => dpt.id === query || dpt.type === query
      )
    );
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

export function buildAppUserMethods(
  baseAppUser: AppUserAttributes
): AppUserMethods {
  return {
    getDepartmentsByType: createGetDepartmentsByTypeMethod(baseAppUser),
    hasPrivileges: createHasPrivilegesMethod(baseAppUser),
    includesDepartments: createIncludesDepartmentsMethod(baseAppUser),
  };
}

export function buildAppUserAuthOnlyMethods(
  dependencies: UserAuthOnlyMethodDeps
): AppUserAuthOnlyMethods {
  return {
    updatePassword: createUpdatePasswordMethod(dependencies),
  };
}
