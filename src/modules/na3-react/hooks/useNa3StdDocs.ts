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
import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useCallback, useRef } from "react";

import type { AppUser, FirebaseOperationResult, StdDocsState } from "../types";
import {
  buildNa3Error,
  buildStdDocument,
  buildStdDocumentEvents,
  buildStdDocumentUrl,
  EventBuildConfig,
  getCollection,
  removeNullables,
  StdDocBuilderData,
} from "../utils";
import { useNa3Users } from "./useNa3Users";
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
    getDocumentTypeFromTypeId: (
      typeId: Na3StdDocumentTypeId
    ) => Na3StdDocumentType;
    getDocumentAcknowledgedUsers: (
      doc: Na3StdDocument
    ) => { user: AppUser; event: Na3StdDocumentEvent }[];
    getUserAcknowledgment: (
      doc: Na3StdDocument,
      user: AppUser,
      versionId?: string
    ) => Na3StdDocumentEvent | undefined;
    getDocumentDownloads: (
      doc: Na3StdDocument,
      versionId?: string
    ) => { user: AppUser; event: Na3StdDocumentEvent }[];
    getUserDownloads: (
      doc: Na3StdDocument,
      user: AppUser,
      versionId?: string
    ) => Na3StdDocumentEvent[];
    getUserPermissionsForDocument: (
      doc: Na3StdDocument,
      user: AppUser
    ) => Record<keyof Na3StdDocumentPermissions, boolean>;
    registerAcknowledgment: (
      docId: string
    ) => Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    >;
    registerDownload: (
      docId: string
    ) => Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    >;
    userCanApproveDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    userCanDownloadDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    userCanPrintDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    userCanReadDocument: (user: AppUser, doc: Na3StdDocument) => boolean;
    approveDocumentVersion: (
      docId: string
    ) => Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    >;
    rejectDocumentVersion: (
      docId: string,
      payload: { comment: string }
    ) => Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    >;
  };
};

export function useNa3StdDocs(): UseNa3StdDocsResult {
  const { environment } = useStateSlice("config");
  const { device } = useStateSlice("global");
  const stdDocs = useStateSlice("stdDocs");

  const {
    currentUser,
    helpers: { getByUid: getUserByUid },
  } = useNa3Users();

  const fbCollectionRef = useRef(getCollection("docs-std", environment));

  const getDocumentById = useCallback(
    (docId: string) => {
      return stdDocs.data?.find((doc) => doc.id === docId);
    },
    [stdDocs.data]
  );

  const getDocumentTypeFromTypeId = useCallback(
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
      return [...getDocumentEvents(doc)].pop();
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
      const latestVersion = getDocumentLatestVersion(doc);
      if (!latestVersion) {
        return "draft";
      }
      const approvals = latestVersion.events.filter(
        (ev) => ev.type === "approve"
      );
      const rejections = latestVersion.events.filter(
        (ev) => ev.type === "reject"
      );
      if (approvals.length >= 1) {
        return "approved";
      }
      if (rejections.length >= 1) {
        return "rejected";
      }
      return "pending";
    },
    [getDocumentLatestVersion]
  );

  const getDocumentAcknowledgedUsers = useCallback(
    (
      doc: Na3StdDocument,
      versionId?: string
    ): { user: AppUser; event: Na3StdDocumentEvent }[] => {
      const version = versionId
        ? doc.versions.find((v) => v.id === versionId)
        : getDocumentLatestVersion(doc);

      return removeNullables(
        (version?.events || [])
          .filter((ev) => ev.type === "acknowledge")
          .map((ev) => {
            const user = getUserByUid(ev.origin.uid);
            if (!user) return undefined;
            return { user, event: ev };
          })
      );
    },
    [getDocumentLatestVersion, getUserByUid]
  );

  const getUserAcknowledgment = useCallback(
    (
      doc: Na3StdDocument,
      user: AppUser,
      versionId?: string
    ): Na3StdDocumentEvent | undefined => {
      return getDocumentAcknowledgedUsers(doc, versionId).find(
        (ack) => ack.user.uid === user.uid
      )?.event;
    },
    [getDocumentAcknowledgedUsers]
  );

  const getDocumentDownloads = useCallback(
    (
      doc: Na3StdDocument,
      versionId?: string
    ): { user: AppUser; event: Na3StdDocumentEvent }[] => {
      const version = versionId
        ? doc.versions.find((v) => v.id === versionId)
        : getDocumentLatestVersion(doc);

      return removeNullables(
        (version?.events || [])
          .filter((ev) => ev.type === "download")
          .map((ev) => {
            const user = getUserByUid(ev.origin.uid);
            if (!user) return undefined;
            return { user, event: ev };
          })
      );
    },
    [getDocumentLatestVersion, getUserByUid]
  );

  const getUserDownloads = useCallback(
    (
      doc: Na3StdDocument,
      user: AppUser,
      versionId?: string
    ): Na3StdDocumentEvent[] => {
      return getDocumentDownloads(doc, versionId)
        .filter((download) => download.user.uid === user.uid)
        .map((download) => download.event);
    },
    [getDocumentDownloads]
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
        const url = await getDownloadURL(
          ref(getStorage(), buildStdDocumentUrl(doc, latestVersion))
        );

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
    (doc: Na3StdDocument, user: AppUser) => {
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
      if (!currentUser) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const document = buildStdDocument(data, { device, user: currentUser });

      try {
        const docRef = await addDoc(fbCollectionRef.current, document);

        const addedDocument = { ...document, id: docRef.id };

        await uploadBytes(
          ref(
            getStorage(),
            buildStdDocumentUrl(addedDocument, addedDocument.versions[0])
          ),
          data.file
        );

        void currentUser.registerEvents({
          DOCS_STD_CREATE: { docId: docRef.id },
        });

        return { data: addedDocument, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [currentUser, device]
  );

  const pushVersionEvent = useCallback(
    async (
      docId: string,
      eventConfig: EventBuildConfig
    ): Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    > => {
      if (!currentUser) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const docRef = doc(fbCollectionRef.current, docId);

      try {
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();

        if (!docData) {
          return {
            data: null,
            error: buildNa3Error("na3/firestore/generic/doc-not-found"),
          };
        }

        const event = buildStdDocumentEvents(eventConfig, {
          device,
          user: currentUser,
        });
        const lastVersion = docData.versions.slice(-1)[0];

        await updateDoc(docRef, {
          versions: [
            ...docData.versions.slice(0, -1),
            { ...lastVersion, events: [...lastVersion.events, event] },
          ],
        });

        return { data: { ...event, version: lastVersion }, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [currentUser, device]
  );

  const registerAcknowledgment = useCallback(
    async (
      docId: string
    ): Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    > => {
      const res = pushVersionEvent(docId, {
        type: "acknowledge",
        payload: { comment: null },
      });
      void currentUser?.registerEvents({ DOCS_STD_ACKNOWLEDGE: { docId } });
      return res;
    },
    [pushVersionEvent, currentUser]
  );

  const registerDownload = useCallback(
    async (
      docId: string
    ): Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    > => {
      const res = pushVersionEvent(docId, {
        type: "download",
        payload: { comment: null },
      });
      void currentUser?.registerEvents({ DOCS_STD_DOWNLOAD: { docId } });
      return res;
    },
    [pushVersionEvent, currentUser]
  );

  const approveDocumentVersion = useCallback(
    async (
      docId: string
    ): Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    > => {
      const res = pushVersionEvent(docId, {
        type: "approve",
        payload: { comment: null },
      });
      void currentUser?.registerEvents({ DOCS_STD_APPROVE: { docId } });
      return res;
    },
    [pushVersionEvent, currentUser]
  );

  const rejectDocumentVersion = useCallback(
    async (
      docId: string,
      payload: { comment: string }
    ): Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    > => {
      const comment = payload.comment.trim();
      const res = pushVersionEvent(docId, {
        type: "reject",
        payload: { comment },
      });
      void currentUser?.registerEvents({ DOCS_STD_REJECT: { docId, comment } });
      return res;
    },
    [pushVersionEvent, currentUser]
  );

  return {
    ...stdDocs,
    helpers: {
      createDocument,
      getDocumentById,
      getDocumentTypeFromTypeId,
      getDocumentEvents,
      getDocumentLastEvent,
      getDocumentLatestVersion,
      getDocumentStatus,
      getDocumentAcknowledgedUsers,
      getUserAcknowledgment,
      getDocumentDownloads,
      getUserDownloads,
      getDocumentDownloadUrl,
      userCanReadDocument,
      userCanPrintDocument,
      userCanDownloadDocument,
      userCanApproveDocument,
      getUserPermissionsForDocument,
      registerAcknowledgment,
      registerDownload,
      approveDocumentVersion,
      rejectDocumentVersion,
    },
  };
}
