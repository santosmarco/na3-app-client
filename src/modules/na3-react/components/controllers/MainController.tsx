import firebase from "firebase";
import { useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3Department } from "../../../na3-types";
import { useNa3Auth } from "../../hooks";
import {
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
  const { loading: authLoading } = useNa3Auth();

  const dispatch = useDispatch();

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

  /* Global state management hooks */

  useEffect(() => {
    dispatch(setGlobalLoading(authLoading || fbDepartmentsLoading));
  }, [dispatch, authLoading, fbDepartmentsLoading]);

  useEffect(() => {
    dispatch(setGlobalDevice(getDevice({ appVersion })));
  }, [dispatch, appVersion]);

  return null;
}
