import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3User,
  Na3UserPrivilegeId,
} from "@modules/na3-types";
import dayjs from "dayjs";
import firebase from "firebase";
import { useMemo, useRef } from "react";
import { useHistory } from "react-router";
import type {
  ConditionalExcept,
  ConditionalPick,
  LiteralUnion,
} from "type-fest";
import type { Falsy } from "utility-types";

import {
  getUserDepartments,
  getUserPositions,
  getUserPrivileges,
} from "../helpers";
import type { AppUser } from "../types";
import { buildNa3Error, resolveCollectionId } from "../utils";
import { useNa3Departments } from "./useNa3Departments";
import { useStateSlice } from "./useStateSlice";

// eslint-disable-next-line @typescript-eslint/ban-types
type AppUserBase = ConditionalExcept<AppUser, Function>;

// eslint-disable-next-line @typescript-eslint/ban-types
type AppUserMethods = ConditionalPick<AppUser, Function>;

export function useCurrentUser(): AppUser | undefined {
  const { environment } = useStateSlice("config");
  const { user, loading: authLoading } = useStateSlice("auth");

  const { data: departments } = useNa3Departments();

  const history = useHistory();

  const usersCollectionRef = useRef(
    firebase
      .firestore()
      .collection(
        resolveCollectionId("NA3-USERS", environment, { forceProduction: true })
      )
  );

  const appUser = useMemo((): AppUser | undefined => {
    if (!user || !departments) {
      return;
    }

    const userPositions = getUserPositions(user, { departments });
    const userDepartments = getUserDepartments(userPositions, { departments });

    const baseUser: AppUserBase = {
      activityHistory: user.activityHistory,
      createdAt: dayjs(user.createdAt),
      departments: userDepartments,
      displayName: user.displayName,
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      isActive: user.isActive,
      isPasswordDefault: user.isPasswordDefault,
      isEmailVerified: user.isEmailVerified,
      isSuper: user.isSuper,
      lastName: user.lastName,
      middleName: user.middleName,
      notificationTokens: user.notificationTokens,
      photoUrl: user.photoUrl,
      positions: userPositions,
      privileges: getUserPrivileges(userPositions),
      registrationId: user.registrationId,
      style: {
        backgroundColor:
          user.style.backgroundColor ||
          userDepartments[0].style.colors.background,
        color: user.style.color || userDepartments[0].style.colors.text,
      },
      updatedAt: dayjs(user.updatedAt),
      isLoading: authLoading,
      bio: user.bio,
      lastSeenAt: dayjs(user.lastSeenAt),
    };

    const userMethods: AppUserMethods = {
      getDepartmentsByType: createGetDepartmentsByTypeHelper(baseUser),
      hasPrivileges: createHasPrivilegesHelper(baseUser),
      includesDepartments: createIncludesDepartmentsHelper(baseUser),
      updatePassword: createUpdatePasswordHelper({
        fbCollectionRef: usersCollectionRef.current,
        onRedirect: () => history.replace("/entrar"),
      }),
    };

    return { ...baseUser, ...userMethods };
  }, [user, authLoading, departments, history]);

  return appUser;
}

function createGetDepartmentsByTypeHelper(
  baseUser: AppUserBase
): AppUserMethods["getDepartmentsByType"] {
  return <T extends Na3DepartmentType>(
    departmentType: T
  ): Na3Department<T>[] => {
    return baseUser.departments.filter(
      (dpt): dpt is Na3Department<T> => dpt.type === departmentType
    );
  };
}

function createHasPrivilegesHelper(
  baseUser: AppUserBase
): AppUserMethods["hasPrivileges"] {
  return (
    privileges: Na3UserPrivilegeId | Na3UserPrivilegeId[],
    options?: { every?: boolean }
  ): boolean => {
    if (baseUser.isSuper) {
      return true;
    }

    const privArr = typeof privileges === "string" ? [privileges] : privileges;

    return privArr[options?.every ? "every" : "some"](
      (priv) =>
        (baseUser.privileges.includes("all") && !priv.startsWith("_super_")) ||
        baseUser.privileges.includes(priv)
    );
  };
}

function createIncludesDepartmentsHelper(
  baseUser: AppUserBase
): AppUserMethods["includesDepartments"] {
  return (
    query:
      | Falsy
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>
      | LiteralUnion<Na3DepartmentId | Na3DepartmentType, string>[]
  ): boolean => {
    const queryArr = typeof query === "string" ? [query] : query;

    return (queryArr || []).some((query) =>
      baseUser.departments.find((dpt) => dpt.id === query || dpt.type === query)
    );
  };
}

function createUpdatePasswordHelper(dependencies: {
  fbCollectionRef: firebase.firestore.CollectionReference;
  onRedirect: () => void;
}): AppUserMethods["updatePassword"] {
  return async (
    newPassword: string
  ): Promise<
    | { error: FirebaseError; warning: null }
    | { error: null; warning: { message: string; title: string } }
    | { error: null; warning: null }
  > => {
    try {
      const firebaseUser = firebase.auth().currentUser;

      if (!firebaseUser) {
        return {
          error: buildNa3Error("na3/user/update-password/not-signed-in"),
          warning: null,
        };
      }

      await firebaseUser.updatePassword(newPassword);

      const updatedUser: Pick<Na3User, "isPasswordDefault"> = {
        isPasswordDefault: false,
      };

      await dependencies.fbCollectionRef
        .doc(firebaseUser.uid)
        .update(updatedUser);

      return { error: null, warning: null };
    } catch (err) {
      const firebaseError = err as FirebaseError;

      if (firebaseError.code === "auth/requires-recent-login") {
        await firebase.auth().signOut();
        dependencies.onRedirect();
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
