import { getDocs } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3MaintenanceProject } from "../../../na3-types";
import { useEnv, useStateSlice } from "../../hooks";
import {
  setMaintProjectsData,
  setMaintProjectsError,
  setMaintProjectsLoading,
} from "../../store/actions";
import { getCollection } from "../../utils";

export function Na3MaintenanceProjectsController(): null {
  const environment = useEnv();
  const { _firebaseUser } = useStateSlice("auth");

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () => getCollection("manut-projects", environment),
    [environment]
  );

  const [fbMaintProjects, fbMaintProjectsLoading, fbMaintProjectsError] =
    useCollectionData<Na3MaintenanceProject, "id">(fbCollectionRef, {
      idField: "id",
    });

  /* MaintProjects state management hooks */

  useEffect(() => {
    dispatch(setMaintProjectsData(fbMaintProjects || null));
  }, [dispatch, fbMaintProjects]);

  useEffect(() => {
    dispatch(setMaintProjectsLoading(fbMaintProjectsLoading));
  }, [dispatch, fbMaintProjectsLoading]);

  useEffect(() => {
    dispatch(setMaintProjectsError(fbMaintProjectsError || null));
  }, [dispatch, fbMaintProjectsError]);

  /* Update on auth */

  const forceRefreshMaintProjects = useCallback(async () => {
    dispatch(setMaintProjectsLoading(true));
    dispatch(setMaintProjectsError(null));
    dispatch(setMaintProjectsData(null));

    if (_firebaseUser) {
      const maintProjectsSnapshot = await getDocs(fbCollectionRef);

      dispatch(
        setMaintProjectsData(
          maintProjectsSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        )
      );
    }

    dispatch(setMaintProjectsLoading(false));
  }, [dispatch, _firebaseUser, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshMaintProjects();
  }, [forceRefreshMaintProjects]);

  return null;
}
