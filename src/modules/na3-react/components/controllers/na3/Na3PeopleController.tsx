import firebase from "firebase";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3ApiPerson } from "../../../../na3-types";
import { useStateSlice } from "../../../hooks";
import {
  setNa3PeopleData,
  setNa3PeopleError,
  setNa3PeopleLoading,
} from "../../../store/actions";
import { resolveCollectionId } from "../../../utils";

export function Na3PeopleController(): null {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () =>
      firebase.firestore().collection(
        resolveCollectionId("API-PEOPLE", environment, {
          forceProduction: true,
        })
      ),
    [environment]
  );

  const [fbNa3People, fbNa3PeopleLoading, fbNa3PeopleError] = useCollectionData<
    Na3ApiPerson,
    "id"
  >(fbCollectionRef, {
    idField: "id",
  });

  /* Na3People state management hooks */

  useEffect(() => {
    dispatch(setNa3PeopleData(fbNa3People || null));
  }, [dispatch, fbNa3People]);

  useEffect(() => {
    dispatch(setNa3PeopleLoading(fbNa3PeopleLoading));
  }, [dispatch, fbNa3PeopleLoading]);

  useEffect(() => {
    dispatch(setNa3PeopleError(fbNa3PeopleError || null));
  }, [dispatch, fbNa3PeopleError]);

  /* Update on auth */

  const forceRefreshNa3People = useCallback(async () => {
    dispatch(setNa3PeopleLoading(true));
    dispatch(setNa3PeopleError(null));
    dispatch(setNa3PeopleData(null));

    if (_firebaseUser) {
      const na3PeopleSnapshot = await fbCollectionRef.get();

      dispatch(
        setNa3PeopleData(
          na3PeopleSnapshot.docs.map((doc) => ({
            ...(doc.data() as Na3ApiPerson),
            id: doc.id,
          })) || null
        )
      );
    }

    dispatch(setNa3PeopleLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshNa3People();
  }, [forceRefreshNa3People]);

  return null;
}
