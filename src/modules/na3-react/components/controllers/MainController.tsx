import firebase from "firebase";
import { useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3Department } from "../../../na3-types";
import { useStateSlice } from "../../hooks";
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
  const auth = useStateSlice("auth");

  const dispatch = useDispatch();

  const [fbDepartments, fbDepartmentsLoading, fbDepartmentsError] =
    useCollectionData<Na3Department>(
      firebase
        .firestore()
        .collection(
          resolveCollectionId("departments", env, { forceProduction: true })
        )
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

  /* Global state management hook */

  useEffect(() => {
    dispatch(setGlobalLoading(auth.loading || fbDepartmentsLoading));
  }, [dispatch, auth.loading, fbDepartmentsLoading]);

  useEffect(() => {
    dispatch(setGlobalDevice(getDevice({ appVersion })));
  }, [dispatch, appVersion]);

  return null;
}
