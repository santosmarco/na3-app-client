import { extractRegistrationIdFromEmail } from "@modules/na3-react/helpers";
import firebase from "firebase";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3Department, Na3User } from "../../../na3-types";
import {
  setAuthError,
  setAuthFirebaseUser,
  setAuthLoading,
  setAuthUser,
  setConfigEnvironment,
  setDepartmentsData,
  setDepartmentsError,
  setDepartmentsLoading,
  setGlobalDevice,
  setGlobalLoading,
} from "../../store/actions";
import type { ConfigState } from "../../types";
import { getDevice, resolveCollectionId } from "../../utils";

type Na3MainControllerProps = {
  appVersion: string;
  env: ConfigState["environment"];
};

export function Na3MainController({
  env,
  appVersion,
}: Na3MainControllerProps): null {
  const dispatch = useDispatch();

  const [fbUser, fbUserLoading, fbUserError] = useAuthState(firebase.auth());
  const [na3User, na3UserLoading, na3UserError] = useCollectionData<
    Na3User,
    "id"
  >(
    firebase
      .firestore()
      .collection(
        resolveCollectionId("NA3-USERS", env, { forceProduction: true })
      )
      .where(
        "registrationId",
        "==",
        extractRegistrationIdFromEmail(fbUser?.email) || null
      ),
    { idField: "id" }
  );

  const [fbDepartments, fbDepartmentsLoading, fbDepartmentsError] =
    useCollectionData<Na3Department, "id">(
      firebase
        .firestore()
        .collection(
          resolveCollectionId("departments", env, { forceProduction: true })
        ),
      { idField: "id" }
    );

  /* Config state management hook */

  useEffect(() => {
    dispatch(setConfigEnvironment(env));
  }, [dispatch, env]);

  /* Auth state management hooks */

  useEffect(() => {
    dispatch(setAuthFirebaseUser(fbUser));
  }, [dispatch, fbUser]);

  useEffect(() => {
    dispatch(setAuthLoading(fbUserLoading || na3UserLoading));
  }, [dispatch, fbUserLoading, na3UserLoading]);

  useEffect(() => {
    dispatch(setAuthError(fbUserError || na3UserError || null));
  }, [dispatch, fbUserError, na3UserError]);

  useEffect(() => {
    dispatch(setAuthUser(na3User?.[0] || null));
  }, [dispatch, na3User]);

  /* Departments state management hooks */

  useEffect(() => {
    dispatch(setDepartmentsData(fbDepartments || null));
  }, [dispatch, fbDepartments]);

  useEffect(() => {
    dispatch(setDepartmentsLoading(fbDepartmentsLoading));
  }, [dispatch, fbDepartmentsLoading]);

  useEffect(() => {
    dispatch(setDepartmentsError(fbDepartmentsError || null));
  }, [dispatch, fbDepartmentsError]);

  /* Global state management hook */

  useEffect(() => {
    dispatch(
      setGlobalLoading(fbUserLoading || na3UserLoading || fbDepartmentsLoading)
    );
  }, [dispatch, fbUserLoading, na3UserLoading, fbDepartmentsLoading]);

  useEffect(() => {
    dispatch(setGlobalDevice(getDevice({ appVersion })));
  }, [dispatch, appVersion]);

  return null;
}
