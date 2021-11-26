import firebase from "firebase";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3User } from "../../../../na3-types";
import { useCurrentUser, useStateSlice } from "../../../hooks";
import {
  setNa3UsersData,
  setNa3UsersError,
  setNa3UsersLoading,
} from "../../../store/actions";
import { resolveCollectionId } from "../../../utils";

export function Na3UsersController(): null {
  const { environment } = useStateSlice("config");

  const user = useCurrentUser();

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () =>
      firebase.firestore().collection(
        resolveCollectionId("NA3-USERS", environment, {
          forceProduction: true,
        })
      ),
    [environment]
  );

  const [fbNa3Users, fbNa3UsersLoading, fbNa3UsersError] = useCollectionData<
    Na3User,
    "id"
  >(fbCollectionRef, { idField: "id" });

  /* Na3Users state management hooks */

  useEffect(() => {
    dispatch(setNa3UsersData(fbNa3Users || null));
  }, [dispatch, fbNa3Users]);

  useEffect(() => {
    dispatch(setNa3UsersLoading(fbNa3UsersLoading));
  }, [dispatch, fbNa3UsersLoading]);

  useEffect(() => {
    dispatch(setNa3UsersError(fbNa3UsersError || null));
  }, [dispatch, fbNa3UsersError]);

  /* Update on auth */

  const forceRefreshUsers = useCallback(async () => {
    dispatch(setNa3UsersLoading(true));
    dispatch(setNa3UsersError(null));
    dispatch(setNa3UsersData(null));

    if (user) {
      const na3UsersSnapshot = await fbCollectionRef.get();

      dispatch(
        setNa3UsersData(
          na3UsersSnapshot.docs.map((doc) => ({
            ...(doc.data() as Na3User),
            id: doc.id,
          })) || null
        )
      );
    }

    dispatch(setNa3UsersLoading(false));
  }, [dispatch, user, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshUsers();
  }, [forceRefreshUsers]);

  return null;
}
