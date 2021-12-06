import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import translateFirebaseError from "@modules/firebase-errors-pt-br";
import type { Na3StdDocument } from "@modules/na3-types";
import firebase from "firebase";
import { useCallback, useRef } from "react";

import type { FirebaseOperationResult, StdDocsState } from "../types";
import type { StdDocBuilderData } from "../utils";
import { buildStdDocument } from "../utils";
import { buildNa3Error, resolveCollectionId } from "../utils";
import { useCurrentUser } from "./useCurrentUser";
import { useStateSlice } from "./useStateSlice";

type UseNa3StdDocsResult = StdDocsState & {
  helpers: {
    createDocument: (
      data: StdDocBuilderData
    ) => Promise<FirebaseOperationResult<Na3StdDocument>>;
  };
};

export function useNa3StdDocs(): UseNa3StdDocsResult {
  const { environment } = useStateSlice("config");
  const { device } = useStateSlice("global");
  const stdDocs = useStateSlice("stdDocs");

  const user = useCurrentUser();

  const fbCollectionRef = useRef(
    firebase
      .firestore()
      .collection(resolveCollectionId("docs-std", environment))
  );

  const createDocument = useCallback(
    async (
      data: StdDocBuilderData
    ): Promise<FirebaseOperationResult<Na3StdDocument>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const document = buildStdDocument(data, { device, user });

      try {
        const docRef = await fbCollectionRef.current.add(document);

        void user.registerEvents({ DOCS_STD_CREATE: { docId: docRef.id } });

        return { data: { ...document, id: docRef.id }, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [user, device]
  );

  return { ...stdDocs, helpers: { createDocument } };
}
