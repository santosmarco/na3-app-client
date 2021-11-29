import firebase from "firebase";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3ApiProduct } from "../../../../na3-types";
import { useStateSlice } from "../../../hooks";
import {
  setNa3ProductsData,
  setNa3ProductsError,
  setNa3ProductsLoading,
} from "../../../store/actions";
import { resolveCollectionId } from "../../../utils";

export function Na3ProductsController(): null {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () =>
      firebase.firestore().collection(
        resolveCollectionId("API-PRODUCTS", environment, {
          forceProduction: true,
        })
      ),
    [environment]
  );

  const [fbNa3Products, fbNa3ProductsLoading, fbNa3ProductsError] =
    useCollectionData<Na3ApiProduct, "id">(fbCollectionRef, {
      idField: "id",
    });

  /* Na3Products state management hooks */

  useEffect(() => {
    dispatch(setNa3ProductsData(fbNa3Products || null));
  }, [dispatch, fbNa3Products]);

  useEffect(() => {
    dispatch(setNa3ProductsLoading(fbNa3ProductsLoading));
  }, [dispatch, fbNa3ProductsLoading]);

  useEffect(() => {
    dispatch(setNa3ProductsError(fbNa3ProductsError || null));
  }, [dispatch, fbNa3ProductsError]);

  /* Update on auth */

  const forceRefreshNa3Products = useCallback(async () => {
    dispatch(setNa3ProductsLoading(true));
    dispatch(setNa3ProductsError(null));
    dispatch(setNa3ProductsData(null));

    if (_firebaseUser) {
      const na3ProductsSnapshot = await fbCollectionRef.get();

      dispatch(
        setNa3ProductsData(
          na3ProductsSnapshot.docs.map((doc) => ({
            ...(doc.data() as Na3ApiProduct),
            id: doc.id,
          })) || null
        )
      );
    }

    dispatch(setNa3ProductsLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshNa3Products();
  }, [forceRefreshNa3Products]);

  return null;
}
