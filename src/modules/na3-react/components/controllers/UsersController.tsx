import { getDocs } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3User } from "../../../na3-types";
import { useStateSlice } from "../../hooks";
import {
  setNa3UsersData,
  setNa3UsersError,
  setNa3UsersLoading,
} from "../../store/actions";
import { getCollection } from "../../utils";

export function Na3UsersController(): null {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () => getCollection("users", environment),
    [environment]
  );

  const [fbNa3Users, fbNa3UsersLoading, fbNa3UsersError] = useCollectionData<
    Omit<Na3User, "uid">,
    "uid"
  >(fbCollectionRef, { idField: "uid" });

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

    if (_firebaseUser) {
      const na3UsersSnapshot = await getDocs(fbCollectionRef);

      dispatch(
        setNa3UsersData(
          na3UsersSnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }))
        )
      );
    }

    dispatch(setNa3UsersLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshUsers();
  }, [forceRefreshUsers]);

  return null;
}
