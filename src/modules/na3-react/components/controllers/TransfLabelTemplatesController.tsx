import { getDocs } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3TransfLabelTemplate } from "../../../na3-types";
import { useStateSlice } from "../../hooks";
import {
  setTransfLabelTemplatesData,
  setTransfLabelTemplatesError,
  setTransfLabelTemplatesLoading,
} from "../../store/actions";
import { getCollection } from "../../utils";

export function Na3TransfLabelTemplatesController(): null {
  const { environment } = useStateSlice("config");
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () => getCollection("transf-label-templates", environment),
    [environment]
  );

  const [
    fbTransfLabelTemplates,
    fbTransfLabelTemplatesLoading,
    fbTransfLabelTemplatesError,
  ] = useCollectionData<Na3TransfLabelTemplate, "id">(fbCollectionRef, {
    idField: "id",
  });

  /* TransfLabelTemplates state management hooks */

  useEffect(() => {
    dispatch(
      setTransfLabelTemplatesData(
        fbTransfLabelTemplates?.sort((a, b) => a.name.localeCompare(b.name)) ||
          null
      )
    );
  }, [dispatch, fbTransfLabelTemplates]);

  useEffect(() => {
    dispatch(setTransfLabelTemplatesLoading(fbTransfLabelTemplatesLoading));
  }, [dispatch, fbTransfLabelTemplatesLoading]);

  useEffect(() => {
    dispatch(setTransfLabelTemplatesError(fbTransfLabelTemplatesError || null));
  }, [dispatch, fbTransfLabelTemplatesError]);

  /* Update on auth */

  const forceRefreshTemplates = useCallback(async () => {
    dispatch(setTransfLabelTemplatesLoading(true));
    dispatch(setTransfLabelTemplatesError(null));
    dispatch(setTransfLabelTemplatesData(null));

    if (_firebaseUser) {
      const templatesSnapshot = await getDocs(fbCollectionRef);

      dispatch(
        setTransfLabelTemplatesData(
          [
            ...templatesSnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            })),
          ].sort((a, b) => a.name.localeCompare(b.name))
        )
      );
    }

    dispatch(setTransfLabelTemplatesLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshTemplates();
  }, [forceRefreshTemplates]);

  return null;
}
