import type { Product } from "@schemas";
import { getDocs } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { useEnv, useStateSlice } from "../../hooks";
import {
  setNativeProductsData,
  setNativeProductsError,
  setNativeProductsLoading,
} from "../../store/actions";
import { getCollection } from "../../utils";

export function Na3NativeProductsController(): null {
  const environment = useEnv();
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () => getCollection("products", environment),
    [environment]
  );

  const [fbNativeProducts, fbNativeProductsLoading, fbNativeProductsError] =
    useCollectionData<Product, "id">(fbCollectionRef, { idField: "id" });

  /* Na3NativeProducts state management hooks */

  useEffect(() => {
    dispatch(setNativeProductsData(fbNativeProducts || null));
  }, [dispatch, fbNativeProducts]);

  useEffect(() => {
    dispatch(setNativeProductsLoading(fbNativeProductsLoading));
  }, [dispatch, fbNativeProductsLoading]);

  useEffect(() => {
    dispatch(setNativeProductsError(fbNativeProductsError || null));
  }, [dispatch, fbNativeProductsError]);

  /* Update on auth */

  const forceRefreshProducts = useCallback(async () => {
    dispatch(setNativeProductsLoading(true));
    dispatch(setNativeProductsError(null));
    dispatch(setNativeProductsData(null));

    if (_firebaseUser) {
      const productsSnapshot = await getDocs(fbCollectionRef);

      dispatch(
        setNativeProductsData(
          productsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      );
    }

    dispatch(setNativeProductsLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshProducts();
  }, [forceRefreshProducts]);

  return null;
}
