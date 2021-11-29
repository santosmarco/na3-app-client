import firebase from "firebase";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3ServiceOrder } from "../../../na3-types";
import { useStateSlice } from "../../hooks";
import {
  setServiceOrdersData,
  setServiceOrdersError,
  setServiceOrdersLoading,
} from "../../store/actions";
import { resolveCollectionId } from "../../utils";

export function Na3ServiceOrdersController(): null {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () =>
      firebase
        .firestore()
        .collection(resolveCollectionId("tickets", environment)),
    [environment]
  );

  const [fbServiceOrders, fbServiceOrdersLoading, fbServiceOrdersError] =
    useCollectionData<Na3ServiceOrder, "id">(fbCollectionRef, {
      idField: "id",
    });

  /* ServiceOrders state management hooks */

  useEffect(() => {
    dispatch(setServiceOrdersData(fbServiceOrders || null));
  }, [dispatch, fbServiceOrders]);

  useEffect(() => {
    dispatch(setServiceOrdersLoading(fbServiceOrdersLoading));
  }, [dispatch, fbServiceOrdersLoading]);

  useEffect(() => {
    dispatch(setServiceOrdersError(fbServiceOrdersError || null));
  }, [dispatch, fbServiceOrdersError]);

  /* Update on auth */

  const forceRefreshServiceOrders = useCallback(async () => {
    dispatch(setServiceOrdersLoading(true));
    dispatch(setServiceOrdersError(null));
    dispatch(setServiceOrdersData(null));

    if (_firebaseUser) {
      const serviceOrdersSnapshot = await fbCollectionRef.get();

      dispatch(
        setServiceOrdersData(
          serviceOrdersSnapshot.docs.map((doc) => ({
            ...(doc.data() as Na3ServiceOrder),
            id: doc.id,
          })) || null
        )
      );
    }

    dispatch(setServiceOrdersLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshServiceOrders();
  }, [forceRefreshServiceOrders]);

  return null;
}
