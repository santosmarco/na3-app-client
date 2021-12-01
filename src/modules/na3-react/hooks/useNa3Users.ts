import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3DepartmentId,
  Na3DepartmentType,
  Na3Position,
  Na3PositionId,
  Na3UserRegistrationId,
} from "@modules/na3-types";
import firebase from "firebase";
import { isArray } from "lodash";
import { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import {
  buildAppUserAttributes,
  buildAppUserAuthOnlyMethods,
  buildAppUserMethods,
} from "../helpers";
import type { AppUser, AppUserAuthenticated, MaybeArray } from "../types";
import { resolveCollectionId } from "../utils";
import { useNa3Departments } from "./useNa3Departments";
import { useStateSlice } from "./useStateSlice";

export type UseNa3UsersResult = {
  currentUser: AppUserAuthenticated | undefined;
  data: AppUser[];
  error: FirebaseError | null;
  helpers: {
    extractRegistrationIdFromEmail: (
      email: string | null | undefined
    ) => Na3UserRegistrationId | undefined;
    formatRegistrationId: (unformatted: string) => Na3UserRegistrationId;
    getAllInDepartments: (
      dptIdsOrTypes: MaybeArray<Na3DepartmentId | Na3DepartmentType>
    ) => AppUser[];
    getAllInPositions: (
      positions: MaybeArray<Na3Position | Na3PositionId>
    ) => AppUser[];
    getAuthEmail: (registrationId: string) => string;
    getByRegistrationId: (registrationId: string) => AppUser | undefined;
    getByUid: (uid: string) => AppUser | undefined;
  };
  loading: boolean;
};

export function useNa3Users(): UseNa3UsersResult {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");
  const na3Users = useStateSlice("na3Users");

  const departments = useNa3Departments();

  const history = useHistory();

  const usersCollectionRef = useMemo(
    () =>
      firebase
        .firestore()
        .collection(resolveCollectionId("users", environment)),
    [environment]
  );

  const loading = useMemo(
    (): boolean => na3Users.loading || departments.loading,
    [na3Users.loading, departments.loading]
  );

  const error = useMemo(
    (): FirebaseError | null => na3Users.error || departments.error,
    [na3Users.error, departments.error]
  );

  const data = useMemo((): AppUser[] => {
    if (loading || error || !na3Users.data) return [];

    return na3Users.data.map((na3User) => {
      const baseUser = buildAppUserAttributes(na3User, {
        departments: departments.data,
      });

      return { ...baseUser, ...buildAppUserMethods(baseUser) };
    });
  }, [loading, error, na3Users.data, departments.data]);

  const currentUser = useMemo((): AppUserAuthenticated | undefined => {
    const basicUser = data.find((user) => user.uid === _firebaseUser?.uid);

    if (!basicUser) return;

    return {
      ...basicUser,
      ...buildAppUserAuthOnlyMethods(basicUser, {
        fbCollectionRef: usersCollectionRef,
        onRedirect: () => history.replace("/entrar"),
      }),
    };
  }, [data, _firebaseUser, usersCollectionRef, history]);

  const formatRegistrationId = useCallback(
    (unformatted: string): Na3UserRegistrationId =>
      parseInt(unformatted)
        .toString()
        .padStart(4, "0") as Na3UserRegistrationId,
    []
  );

  const getAuthEmail = useCallback(
    (registrationId: string): string =>
      `${formatRegistrationId(registrationId)}@novaa3-app.com.br`,
    [formatRegistrationId]
  );

  const extractRegistrationIdFromEmail = useCallback(
    (email: string | null | undefined): Na3UserRegistrationId | undefined =>
      email ? formatRegistrationId(email.split("@")[0]) : undefined,
    [formatRegistrationId]
  );

  const getByUid = useCallback(
    (uid: string): AppUser | undefined =>
      data.find((user) => user.uid.trim() === uid.trim()),
    [data]
  );

  const getByRegistrationId = useCallback(
    (registrationId: string): AppUser | undefined => {
      return data.find(
        (user) => user.registrationId === formatRegistrationId(registrationId)
      );
    },
    [data, formatRegistrationId]
  );

  const getAllInDepartments = useCallback(
    (dptIdsOrTypes: MaybeArray<Na3DepartmentId | Na3DepartmentType>) => {
      const queryDptIds = departments.helpers
        .getByIdsOrTypes(dptIdsOrTypes)
        .map((dpt) => dpt.id);

      return data.filter((user) =>
        user.departments
          .map((dpt) => dpt.id)
          .some((dptId) => queryDptIds.includes(dptId))
      );
    },
    [data, departments.helpers]
  );

  const getAllInPositions = useCallback(
    (positions: MaybeArray<Na3Position | Na3PositionId>) => {
      const positionIds = (isArray(positions) ? positions : [positions]).map(
        (pos) => (typeof pos === "string" ? pos : pos.id)
      );

      return data.filter((user) =>
        user.positions.some((position) => positionIds.includes(position.id))
      );
    },
    [data]
  );

  return {
    data,
    error,
    loading,
    currentUser,
    helpers: {
      formatRegistrationId,
      getAuthEmail,
      extractRegistrationIdFromEmail,
      getByUid,
      getByRegistrationId,
      getAllInDepartments,
      getAllInPositions,
    },
  };
}
