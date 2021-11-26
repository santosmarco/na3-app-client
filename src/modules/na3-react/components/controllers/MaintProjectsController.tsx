import firebase from "firebase";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";

import type { Na3MaintenanceProject } from "../../../na3-types";
import { useCurrentUser, useStateSlice } from "../../hooks";
import {
  setMaintProjectsData,
  setMaintProjectsError,
  setMaintProjectsLoading,
} from "../../store/actions";
import { resolveCollectionId } from "../../utils";

export function Na3MaintenanceProjectsController(): null {
  const { environment } = useStateSlice("config");

  const user = useCurrentUser();

  const dispatch = useDispatch();

  const fbCollectionRef = useMemo(
    () =>
      firebase
        .firestore()
        .collection(resolveCollectionId("manut-projects", environment)),
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

    if (user) {
      const maintProjectsSnapshot = await fbCollectionRef.get();

      dispatch(
        setMaintProjectsData(
          maintProjectsSnapshot.docs.map((doc) => ({
            ...(doc.data() as Na3MaintenanceProject),
            id: doc.id,
          })) || null
        )
      );
    }

    dispatch(setMaintProjectsLoading(false));
  }, [dispatch, user, fbCollectionRef]);

  useEffect(() => {
    void forceRefreshMaintProjects();
  }, [forceRefreshMaintProjects]);

  return null;
}
