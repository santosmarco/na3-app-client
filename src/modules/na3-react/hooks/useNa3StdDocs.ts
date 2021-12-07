import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import translateFirebaseError from "@modules/firebase-errors-pt-br";
import type {
  Na3StdDocument,
  Na3StdDocumentEvent,
  Na3StdDocumentStatus,
  Na3StdDocumentType,
  Na3StdDocumentTypeId,
  Na3StdDocumentVersion,
} from "@modules/na3-types";
import { NA3_STD_DOCUMENT_TYPES } from "@modules/na3-types";
import firebase from "firebase";
import { useCallback, useRef } from "react";

import type { FirebaseOperationResult, StdDocsState } from "../types";
import type { StdDocBuilderData } from "../utils";
import { buildNa3Error, buildStdDocument, resolveCollectionId } from "../utils";
import { useCurrentUser } from "./useCurrentUser";
import { useStateSlice } from "./useStateSlice";

type UseNa3StdDocsResult = StdDocsState & {
  helpers: {
    createDocument: (
      data: StdDocBuilderData & { file: File }
    ) => Promise<FirebaseOperationResult<Na3StdDocument>>;
    getDocumentEvents: (doc: Na3StdDocument) => Na3StdDocumentEvent[];
    getDocumentLastEvent: (
      doc: Na3StdDocument
    ) => Na3StdDocumentEvent | undefined;
    getDocumentLatestVersion: (
      doc: Na3StdDocument
    ) => Na3StdDocumentVersion | undefined;
    getDocumentStatus: (doc: Na3StdDocument) => Na3StdDocumentStatus;
    getTypeFromTypeId: (typeId: Na3StdDocumentTypeId) => Na3StdDocumentType;
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
  const fbStorageRef = useRef(
    firebase.storage().ref(resolveCollectionId("docs-std", environment))
  );

  const getTypeFromTypeId = useCallback(
    (typeId: Na3StdDocumentTypeId): Na3StdDocumentType => {
      return NA3_STD_DOCUMENT_TYPES[typeId];
    },
    []
  );

  const getDocumentEvents = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentEvent[] => {
      return [...doc.versions].flatMap((v) => v.events);
    },
    []
  );

  const getDocumentLastEvent = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentEvent | undefined => {
      return getDocumentEvents(doc).pop();
    },
    [getDocumentEvents]
  );

  const getDocumentLatestVersion = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentVersion | undefined => {
      return [...doc.versions].pop();
    },
    []
  );

  const getDocumentStatus = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentStatus => {
      const lastEvent = getDocumentLastEvent(doc);
      switch (lastEvent?.type) {
        case "approve":
          return "approved";
        case "reject":
          return "rejected";
        case "update":
        case "create":
          return "pending";
        default:
          return "draft";
      }
    },
    [getDocumentLastEvent]
  );

  const createDocument = useCallback(
    async (
      data: StdDocBuilderData & { file: File }
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

        await fbStorageRef.current
          .child(`${docRef.id}_v${document.versions[0].id}`)
          .put(data.file);

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

  return {
    ...stdDocs,
    helpers: {
      createDocument,
      getTypeFromTypeId,
      getDocumentEvents,
      getDocumentLastEvent,
      getDocumentLatestVersion,
      getDocumentStatus,
    },
  };
}
