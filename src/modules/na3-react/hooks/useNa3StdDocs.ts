import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import translateFirebaseError from "@modules/firebase-errors-pt-br";
import type {
  Na3StdDocument,
  Na3StdDocumentEvent,
  Na3StdDocumentPermissions,
  Na3StdDocumentStatus,
  Na3StdDocumentType,
  Na3StdDocumentTypeId,
  Na3StdDocumentVersion,
} from "@modules/na3-types";
import { NA3_STD_DOCUMENT_TYPES } from "@modules/na3-types";
import firebase from "firebase";
import { useCallback, useRef } from "react";

import type { AppUser, FirebaseOperationResult, StdDocsState } from "../types";
import type { StdDocBuilderData } from "../utils";
import {
  buildNa3Error,
  buildStdDocument,
  buildStdDocumentUrl,
  resolveCollectionId,
} from "../utils";
import { useCurrentUser } from "./useCurrentUser";
import { useStateSlice } from "./useStateSlice";

type UseNa3StdDocsResult = StdDocsState & {
  helpers: {
    createDocument: (
      data: StdDocBuilderData & { file: File }
    ) => Promise<FirebaseOperationResult<Na3StdDocument>>;
    getDocumentById: (docId: string) => Na3StdDocument | undefined;
    getDocumentDownloadUrl: (
      doc: Na3StdDocument
    ) => Promise<FirebaseOperationResult<string>>;
    getDocumentEvents: (doc: Na3StdDocument) => Na3StdDocumentEvent[];
    getDocumentLastEvent: (
      doc: Na3StdDocument
    ) => Na3StdDocumentEvent | undefined;
    getDocumentLatestVersion: (
      doc: Na3StdDocument
    ) => Na3StdDocumentVersion | undefined;
    getDocumentStatus: (doc: Na3StdDocument) => Na3StdDocumentStatus;
    getTypeFromTypeId: (typeId: Na3StdDocumentTypeId) => Na3StdDocumentType;
    getUserPermissionsForDocument: (
      user: AppUser,
      doc: Na3StdDocument
    ) => Record<keyof Na3StdDocumentPermissions, boolean>;
    userCanApproveDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    userCanDownloadDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    userCanPrintDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    userCanReadDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
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

  const getDocumentById = useCallback(
    (docId: string) => {
      return stdDocs.data?.find((doc) => doc.id === docId);
    },
    [stdDocs.data]
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

  const getDocumentDownloadUrl = useCallback(
    async (doc: Na3StdDocument): Promise<FirebaseOperationResult<string>> => {
      const latestVersion = getDocumentLatestVersion(doc);

      if (!latestVersion) {
        return {
          error: buildNa3Error("na3/storage/docs-std/doc-not-found"),
          data: null,
        };
      }

      try {
        const url = await (fbStorageRef.current
          .child(buildStdDocumentUrl(doc, latestVersion))
          .getDownloadURL() as Promise<string>);

        return { error: null, data: url };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [getDocumentLatestVersion]
  );

  const userCanReadDocument = useCallback(
    (user: AppUser, doc: Na3StdDocument): boolean => {
      return (
        user.isSuper ||
        user.hasPrivileges("docs_std_read_all") ||
        (user.hasPrivileges("docs_std_read_own") &&
          doc.permissions.read.some((positionAllowed) =>
            user.positions.map((pos) => pos.id).includes(positionAllowed)
          ))
      );
    },
    []
  );

  const userCanPrintDocument = useCallback(
    (user: AppUser, doc: Na3StdDocument): boolean => {
      return (
        user.isSuper ||
        (user.hasPrivileges("docs_std_read_own") &&
          doc.permissions.print.some((positionAllowed) =>
            user.positions.map((pos) => pos.id).includes(positionAllowed)
          ))
      );
    },
    []
  );

  const userCanDownloadDocument = useCallback(
    (user: AppUser, doc: Na3StdDocument): boolean => {
      return (
        user.isSuper ||
        (user.hasPrivileges("docs_std_read_own") &&
          doc.permissions.download.some((positionAllowed) =>
            user.positions.map((pos) => pos.id).includes(positionAllowed)
          ))
      );
    },
    []
  );

  const userCanApproveDocument = useCallback(
    (user: AppUser, doc: Na3StdDocument): boolean => {
      return (
        user.isSuper ||
        (user.hasPrivileges("docs_std_approve_all") &&
          doc.permissions.approve.some((positionAllowed) =>
            user.positions.map((pos) => pos.id).includes(positionAllowed)
          ))
      );
    },
    []
  );

  const getUserPermissionsForDocument = useCallback(
    (user: AppUser, doc: Na3StdDocument) => {
      return {
        read: userCanReadDocument(user, doc),
        print: userCanPrintDocument(user, doc),
        download: userCanDownloadDocument(user, doc),
        approve: userCanApproveDocument(user, doc),
      };
    },
    [
      userCanReadDocument,
      userCanPrintDocument,
      userCanDownloadDocument,
      userCanApproveDocument,
    ]
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

        const addedDocument = { ...document, id: docRef.id };

        await fbStorageRef.current
          .child(buildStdDocumentUrl(addedDocument, addedDocument.versions[0]))
          .put(data.file);

        void user.registerEvents({ DOCS_STD_CREATE: { docId: docRef.id } });

        return { data: addedDocument, error: null };
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
      getDocumentById,
      getTypeFromTypeId,
      getDocumentEvents,
      getDocumentLastEvent,
      getDocumentLatestVersion,
      getDocumentStatus,
      getDocumentDownloadUrl,
      userCanReadDocument,
      userCanPrintDocument,
      userCanDownloadDocument,
      userCanApproveDocument,
      getUserPermissionsForDocument,
    },
  };
}
