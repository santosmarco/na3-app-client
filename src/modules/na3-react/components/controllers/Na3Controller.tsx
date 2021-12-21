import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import translateFirebaseError from "@modules/firebase-errors-pt-br";
import { getDocs } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import type { ConditionalKeys } from "type-fest";

import { useSelector } from "../../hooks";
import type { RootState } from "../../types";
import type { CollectionData, CollectionId } from "../../utils";
import { getCollection } from "../../utils";

type StateKey = ConditionalKeys<
  RootState,
  Record<"data" | "error" | "loading", unknown>
>;

type DispatchHandler<T extends StateKey, U extends keyof RootState[T]> = (
  actionPayload: RootState[T][U]
) => Record<U, RootState[T][U]> & { type: string };

type Na3ControllerProps<T extends CollectionId, U extends StateKey> = {
  collectionId: T;
  onDataDispatch: DispatchHandler<U, "data">;
  onErrorDispatch: DispatchHandler<U, "error">;
  onLoadingDispatch: DispatchHandler<U, "loading">;
  stateKey: U;
};

export function Na3Controller<T extends CollectionId, U extends StateKey>({
  collectionId,
  stateKey,
  onDataDispatch,
  onLoadingDispatch,
  onErrorDispatch,
}: Na3ControllerProps<T, U>): null {
  const env = useSelector((state) => state.config.environment);
  const firebaseUserId = useSelector((state) => state.auth._firebaseUser?.uid);

  const data = useSelector((state) => state[stateKey].data);
  const loading = useSelector((state) => state[stateKey].loading);
  const error = useSelector((state) => state[stateKey].error);

  const dispatch = useDispatch();

  const collectionRef = useMemo(
    () => getCollection(collectionId, env),
    [collectionId, env]
  );

  const [collectionData, collectionLoading, collectionError] =
    useCollectionData(collectionRef, {
      idField: "id",
    });

  const handleDataDispatch = useCallback(
    (options?: { compareTo?: Array<CollectionData<T>> | null }) => {
      const newData = (
        options?.compareTo === undefined ? collectionData : options.compareTo
      ) as RootState[U]["data"] | undefined;

      if (shouldDataDispatch(data, newData)) {
        dispatch(onDataDispatch(newData || null));
      }
    },
    [collectionData, data, dispatch, onDataDispatch]
  );

  const handleLoadingDispatch = useCallback(
    (options?: { compareTo?: boolean }) => {
      const newLoading = options?.compareTo ?? collectionLoading;

      if (shouldLoadingDispatch(loading, newLoading)) {
        dispatch(onLoadingDispatch(newLoading));
      }
    },
    [collectionLoading, loading, dispatch, onLoadingDispatch]
  );

  const handleErrorDispatch = useCallback(
    (options?: { compareTo?: FirebaseError | null }) => {
      const newError =
        options?.compareTo === undefined ? collectionError : options.compareTo;

      const newErrorTranslated = newError && translateFirebaseError(newError);

      if (shouldErrorDispatch(error, newErrorTranslated)) {
        dispatch(onErrorDispatch(newErrorTranslated || null));
      }
    },
    [collectionError, error, dispatch, onErrorDispatch]
  );

  const handleRefreshOnAuth = useCallback(async () => {
    if (firebaseUserId) {
      handleLoadingDispatch({ compareTo: true });
      handleErrorDispatch({ compareTo: null });
      handleDataDispatch({ compareTo: null });

      try {
        const querySnap = await getDocs(collectionRef);
        const docsSnap = querySnap.docs;
        handleDataDispatch({
          compareTo: docsSnap.map((doc) => ({ ...doc.data(), id: doc.id })),
        });
      } catch (err) {
        handleErrorDispatch({
          compareTo: translateFirebaseError(err as FirebaseError),
        });
      } finally {
        handleLoadingDispatch({ compareTo: false });
      }
    }
  }, [
    firebaseUserId,
    collectionRef,
    handleLoadingDispatch,
    handleErrorDispatch,
    handleDataDispatch,
  ]);

  useEffect(handleDataDispatch, [handleDataDispatch]);

  useEffect(handleLoadingDispatch, [handleLoadingDispatch]);

  useEffect(handleErrorDispatch, [handleErrorDispatch]);

  useEffect(() => {
    void handleRefreshOnAuth();
  }, [handleRefreshOnAuth]);

  return null;
}

function shouldDataDispatch<T extends CollectionId>(
  prev: Array<CollectionData<T>> | null,
  next: Array<CollectionData<T>> | null | undefined
): boolean {
  if (prev || next) {
    return true;
  }
  return false;
}

function shouldLoadingDispatch(prev: boolean, next: boolean): boolean {
  if (prev !== next) {
    return true;
  }
  return false;
}

function shouldErrorDispatch(
  prev: FirebaseError | null,
  next: FirebaseError | null | undefined
): boolean {
  if ((prev || next) && prev?.code !== next?.code) {
    return true;
  }
  return false;
}
