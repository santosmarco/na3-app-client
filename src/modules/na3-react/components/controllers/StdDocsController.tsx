import type { Na3StdDocument } from "@modules/na3-types";
import { getDocs } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import { useStateSlice } from "../../hooks";
import {
  setStdDocsData,
  setStdDocsError,
  setStdDocsLoading,
} from "../../store/actions";
import { getCollection } from "../../utils";

export function Na3StdDocsController(): null {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () => getCollection("docs-std", environment),
    [environment]
  );

  const [fbStdDocs, fbStdDocsLoading, fbStdDocsError] = useCollectionData<
    Na3StdDocument,
    "id"
  >(fbCollectionRef, {
    idField: "id",
  });

  /* StdDocs state management hooks */

  useEffect(() => {
    dispatch(setStdDocsData(fbStdDocs || null));
  }, [dispatch, fbStdDocs]);

  useEffect(() => {
    dispatch(setStdDocsLoading(fbStdDocsLoading));
  }, [dispatch, fbStdDocsLoading]);

  useEffect(() => {
    dispatch(setStdDocsError(fbStdDocsError || null));
  }, [dispatch, fbStdDocsError]);

  /* Update on auth */

  const forceRefreshStdDocs = useCallback(async () => {
    dispatch(setStdDocsLoading(true));
    dispatch(setStdDocsError(null));
    dispatch(setStdDocsData(null));

    if (_firebaseUser) {
      const stdDocsSnapshot = await getDocs(fbCollectionRef);

      dispatch(
        setStdDocsData(
          stdDocsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      );
    }

    dispatch(setStdDocsLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshStdDocs();
  }, [forceRefreshStdDocs]);

  return null;
}
