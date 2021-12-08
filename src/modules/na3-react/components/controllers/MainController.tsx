import { useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { useNa3Auth } from "../../hooks";
import {
  setConfigEnvironment,
  setConfigMsgTokensStorageKey,
  setDepartmentsData,
  setDepartmentsError,
  setDepartmentsLoading,
  setGlobalDevice,
  setGlobalLoading,
} from "../../store/actions";
import type { ConfigState } from "../../types";
import { getCollection, getDevice } from "../../utils";

type Na3MainControllerProps = {
  appVersion: string;
  env: ConfigState["environment"];
  messagingTokensStorageKey: string | undefined;
};

export function Na3MainController({
  env,
  appVersion,
  messagingTokensStorageKey,
}: Na3MainControllerProps): null {
  const { loading: authLoading } = useNa3Auth();

  const dispatch = useDispatch();

  const [fbDepartments, fbDepartmentsLoading, fbDepartmentsError] =
    useCollectionData(
      getCollection("departments", env, { forceProduction: true })
    );

  /* Config state management hook */

  useEffect(() => {
    dispatch(setConfigEnvironment(env));
  }, [dispatch, env]);

  useEffect(() => {
    if (messagingTokensStorageKey) {
      dispatch(setConfigMsgTokensStorageKey(messagingTokensStorageKey));
    }
  }, [dispatch, messagingTokensStorageKey]);

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
