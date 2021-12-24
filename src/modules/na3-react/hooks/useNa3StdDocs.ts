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
import dayjs from "dayjs";
import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useRef } from "react";

import type {
  AppUser,
  FirebaseOperationResult,
  MaybeArray,
  StdDocsState,
} from "../types";
import type { EventBuildConfig, StdDocBuilderData } from "../utils";
import {
  buildNa3Error,
  buildStdDocument,
  buildStdDocumentEvents,
  buildStdDocumentUrl,
  getCollection,
  getFolder,
  handleFilterFalsies,
} from "../utils";
import { useEnv } from "./useEnv";
import { useNa3Users } from "./useNa3Users";
import { useStateSlice } from "./useStateSlice";

type Na3StdDocumentActionId = "approve" | "edit" | "reject" | "upgrade";

type UseNa3StdDocsResult = StdDocsState & {
  helpers: {
    approveDocumentVersion: (
      docId: string
    ) => Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    >;
    checkDocumentHasBeenReleased: (doc: Na3StdDocument) => boolean;
    checkDocumentIsOutdated: (doc: Na3StdDocument) => boolean;
    checkDocumentIsUpgrading: (doc: Na3StdDocument) => boolean;
    checkDocumentRequiresAcknowledgement: (
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      user: AppUser
    ) => boolean;
    createDocument: (
      data: StdDocBuilderData & { file: File }
    ) => Promise<FirebaseOperationResult<Na3StdDocument>>;
    editDocumentVersion: (
      docId: string,
      data: StdDocBuilderData & { comment: string; file: File }
    ) => Promise<FirebaseOperationResult<Na3StdDocument>>;
    getDocumentAcknowledgedUsers: (
      doc: Na3StdDocument,
      versionId?: string
    ) => Array<{ event: Na3StdDocumentEvent; user: AppUser }>;
    getDocumentActions: (
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      user: AppUser
    ) => Na3StdDocumentActionId[] | undefined;
    getDocumentById: (docId: string) => Na3StdDocument | undefined;
    getDocumentDownloads: (
      doc: Na3StdDocument,
      versionId?: string
    ) => Array<{ event: Na3StdDocumentEvent; user: AppUser }>;
    getDocumentEvents: (doc: Na3StdDocument) => Na3StdDocumentEvent[];
    getDocumentLastEvent: (
      doc: Na3StdDocument
    ) => Na3StdDocumentEvent | undefined;
    getDocumentLatestApprovedVersion: (
      doc: Na3StdDocument
    ) => Na3StdDocumentVersion | undefined;
    getDocumentLatestVersion: (
      doc: Na3StdDocument
    ) => Na3StdDocumentVersion | undefined;
    getDocumentLatestVersionForUser: (
      doc: Na3StdDocument,
      user: AppUser
    ) => Na3StdDocumentVersion | undefined;
    getDocumentStatus: (doc: Na3StdDocument) => Na3StdDocumentStatus;
    getDocumentTypeFromTypeId: (
      typeId: Na3StdDocumentTypeId
    ) => Na3StdDocumentType;
    getDocumentVersionDownloadUrl: (
      doc: Na3StdDocument,
      version: Na3StdDocumentVersion
    ) => Promise<FirebaseOperationResult<string>>;
    getDocumentVersionStatus: (
      docVersion: Na3StdDocumentVersion
    ) => Na3StdDocumentStatus;
    getUserAcknowledgment: (
      doc: Na3StdDocument,
      user: AppUser,
      versionId?: string
    ) => Na3StdDocumentEvent | undefined;
    getUserDownloads: (
      doc: Na3StdDocument,
      user: AppUser,
      versionId?: string
    ) => Na3StdDocumentEvent[];
    getUserPermissionsForDocument: (
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      user: AppUser
    ) => Record<
      keyof Na3StdDocumentPermissions | "view" | "viewAdditionalInfo" | "write",
      boolean
    >;
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
    rejectDocumentVersion: (
      docId: string,
      payload: { comment: string }
    ) => Promise<
      FirebaseOperationResult<
        Na3StdDocumentEvent & { version: Na3StdDocumentVersion }
      >
    >;
    upgradeDocument: (
      docId: string,
      data: StdDocBuilderData & { comment: string; file: File }
    ) => Promise<FirebaseOperationResult<Na3StdDocument>>;
    userHasDocumentPermissions: (
      user: AppUser,
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      permissions: MaybeArray<keyof Na3StdDocumentPermissions>
    ) => boolean;
  };
};

export function useNa3StdDocs(): UseNa3StdDocsResult {
  const environment = useEnv();
  const { device } = useStateSlice("global");
  const stdDocs = useStateSlice("stdDocs");

  const {
    currentUser,
    helpers: { getByUid: getUserByUid },
  } = useNa3Users();

  const fbCollectionRef = useRef(getCollection("docs-std", environment));
  const fbStorageRef = useRef(getFolder("docs-std", environment));

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

  const getDocumentVersionStatus = useCallback(
    (docVersion: Na3StdDocumentVersion): Na3StdDocumentStatus => {
      const approvals = docVersion.events.filter((ev) => ev.type === "approve");
      const rejections = docVersion.events.filter((ev) => ev.type === "reject");

      if (approvals.length >= 1) {
        return "approved";
      }
      if (rejections.length >= 1) {
        return "rejected";
      }
      return "pending";
    },
    []
  );

  const getDocumentLatestVersion = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentVersion | undefined => {
      return [...doc.versions].pop();
    },
    []
  );

  const getDocumentLatestApprovedVersion = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentVersion | undefined => {
      return [...doc.versions]
        .filter((version) => getDocumentVersionStatus(version) === "approved")
        .pop();
    },
    [getDocumentVersionStatus]
  );

  const getDocumentLatestVersionForUser = useCallback(
    (doc: Na3StdDocument, user: AppUser): Na3StdDocumentVersion | undefined => {
      if (
        user.isSuper ||
        user.hasPrivileges(["docs_std_super", "docs_std_write_new"])
      ) {
        return getDocumentLatestVersion(doc);
      }
      return getDocumentLatestApprovedVersion(doc);
    },
    [getDocumentLatestVersion, getDocumentLatestApprovedVersion]
  );

  const getDocumentLatestVersionForCurrentUser = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentVersion | undefined => {
      return currentUser && getDocumentLatestVersionForUser(doc, currentUser);
    },
    [currentUser, getDocumentLatestVersionForUser]
  );

  const getDocumentStatus = useCallback(
    (doc: Na3StdDocument): Na3StdDocumentStatus => {
      const latestVersion = getDocumentLatestVersion(doc);

      if (!latestVersion) {
        return "draft";
      }

      return getDocumentVersionStatus(latestVersion);
    },
    [getDocumentLatestVersion, getDocumentVersionStatus]
  );

  const getDocumentAcknowledgedUsers = useCallback(
    (
      doc: Na3StdDocument,
      versionId?: string
    ): Array<{ event: Na3StdDocumentEvent; user: AppUser }> => {
      const version = versionId
        ? doc.versions.find((v) => v.id === versionId)
        : getDocumentLatestVersionForCurrentUser(doc);

      return (version?.events || [])
        .filter((ev) => ev.type === "acknowledge")
        .map((ev) => {
          const user = getUserByUid(ev.origin.uid);

          if (!user) {
            return undefined;
          }
          return { user, event: ev };
        })
        .filter(handleFilterFalsies);
    },
    [getDocumentLatestVersionForCurrentUser, getUserByUid]
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
    ): Array<{ event: Na3StdDocumentEvent; user: AppUser }> => {
      const version = versionId
        ? doc.versions.find((v) => v.id === versionId)
        : getDocumentLatestVersionForCurrentUser(doc);

      return (version?.events || [])
        .filter((ev) => ev.type === "download")
        .map((ev) => {
          const user = getUserByUid(ev.origin.uid);

          if (!user) {
            return undefined;
          }
          return { user, event: ev };
        })
        .filter(handleFilterFalsies);
    },
    [getDocumentLatestVersionForCurrentUser, getUserByUid]
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

  const getDocumentVersionDownloadUrl = useCallback(
    async (
      doc: Na3StdDocument,
      version: Na3StdDocumentVersion
    ): Promise<FirebaseOperationResult<string>> => {
      try {
        const url = await getDownloadURL(
          ref(fbStorageRef.current, buildStdDocumentUrl(doc, version))
        );
        return { error: null, data: url };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    []
  );

  const userHasDocumentPermissions = useCallback(
    (
      user: AppUser,
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      permissions: MaybeArray<
        | keyof Na3StdDocumentPermissions
        | "view"
        | "viewAdditionalInfo"
        | "write"
      >
    ): boolean => {
      const permissionsArr =
        typeof permissions === "string" ? [permissions] : [...permissions];

      return (
        // Super users have permission for everything.
        user.isSuper ||
        // So do users with the "docs_std_super" privilege.
        user.hasPrivileges("docs_std_super") ||
        permissionsArr.every((permissionToCheck) => {
          // Only Super users or users with the "docs_std_super" privilege
          // can approve documents.
          if (permissionToCheck === "approve") {
            return false;
          }
          // Apart from approving documents, users with the "docs_std_read_all"
          // privilege have permission for all other actions.
          if (user.hasPrivileges("docs_std_read_all")) {
            return true;
          }
          // Only Super users or those with either the "docs_std_super" or
          // "docs_std_read_all" privilege can view document's additional
          // information.
          if (permissionToCheck === "viewAdditionalInfo") {
            return false;
          }
          // Only users with the "docs_std_write_new" privilege can write to
          // documents.
          if (permissionToCheck === "write") {
            return user.hasPrivileges("docs_std_write_new");
          }
          // Regular users can only view document's content if it has been
          // approved.
          if (permissionToCheck === "view") {
            return getDocumentVersionStatus(docVersion) === "approved";
          }
          // Check permission against document's.
          return doc.permissions[permissionToCheck].some((positionAllowed) =>
            user.positions.map((pos) => pos.id).includes(positionAllowed)
          );
        })
      );
    },
    [getDocumentVersionStatus]
  );

  const getUserPermissionsForDocument = useCallback(
    (doc: Na3StdDocument, docVersion: Na3StdDocumentVersion, user: AppUser) => {
      return {
        read: userHasDocumentPermissions(user, doc, docVersion, "read"),
        print: userHasDocumentPermissions(user, doc, docVersion, "print"),
        download: userHasDocumentPermissions(user, doc, docVersion, "download"),
        approve: userHasDocumentPermissions(user, doc, docVersion, "approve"),
        view: userHasDocumentPermissions(user, doc, docVersion, "view"),
        write: userHasDocumentPermissions(user, doc, docVersion, "write"),
        viewAdditionalInfo: userHasDocumentPermissions(
          user,
          doc,
          docVersion,
          "viewAdditionalInfo"
        ),
      };
    },
    [userHasDocumentPermissions]
  );

  const getDocumentActions = useCallback(
    (
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      user: AppUser
    ): Na3StdDocumentActionId[] | undefined => {
      if (user.isSuper) {
        return ["edit", "upgrade", "approve", "reject"];
      }

      const docStatus = getDocumentStatus(doc);
      const userPermissions = getUserPermissionsForDocument(
        doc,
        docVersion,
        user
      );

      if (userPermissions.approve) {
        if (docStatus === "pending") {
          return ["approve", "reject"];
        }
        return;
      }

      if (userPermissions.write) {
        if (docStatus === "pending" || docStatus === "draft") {
          return ["edit"];
        }
        return ["upgrade"];
      }

      return;
    },
    [getDocumentStatus, getUserPermissionsForDocument]
  );

  const checkDocumentIsOutdated = useCallback(
    (doc: Na3StdDocument): boolean => {
      return dayjs(doc.nextRevisionAt).isBefore(dayjs());
    },
    []
  );

  const checkDocumentHasBeenReleased = useCallback(
    (doc: Na3StdDocument): boolean => {
      return !!getDocumentLatestApprovedVersion(doc);
    },
    [getDocumentLatestApprovedVersion]
  );

  const checkDocumentRequiresAcknowledgement = useCallback(
    (
      doc: Na3StdDocument,
      docVersion: Na3StdDocumentVersion,
      user: AppUser
    ): boolean => {
      if (user.isSuper) {
        return true;
      }

      const userPermissions = getUserPermissionsForDocument(
        doc,
        docVersion,
        user
      );

      if (userPermissions.approve || userPermissions.write) {
        return false;
      }
      return true;
    },
    [getUserPermissionsForDocument]
  );

  const checkDocumentIsUpgrading = useCallback(
    (doc: Na3StdDocument): boolean => {
      const latestVersion = getDocumentLatestVersion(doc);
      const latestApprovedVersion = getDocumentLatestApprovedVersion(doc);

      return latestVersion?.number !== latestApprovedVersion?.number;
    },
    [getDocumentLatestVersion, getDocumentLatestApprovedVersion]
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

        if (!docSnap.exists()) {
          return {
            data: null,
            error: buildNa3Error("na3/firestore/generic/doc-not-found"),
          };
        }

        const docData = { ...docSnap.data(), id: docSnap.id };

        const event = buildStdDocumentEvents(eventConfig, {
          device,
          user: currentUser,
        });

        const versionToModify = getDocumentLatestVersionForCurrentUser(docData);

        if (!versionToModify) {
          return {
            data: null,
            error: buildNa3Error("na3/firestore/generic/doc-not-found"),
          };
        }

        await updateDoc(docRef, {
          versions: docData.versions.map((version) => {
            if (version.id !== versionToModify.id) {
              return version;
            }
            return { ...version, events: [...version.events, event] };
          }),
        });

        return { data: { ...event, version: versionToModify }, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [currentUser, device, getDocumentLatestVersionForCurrentUser]
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
            fbStorageRef.current,
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

  const modifyDocument = useCallback(
    async (
      docId: string,
      data: StdDocBuilderData & { comment: string; file: File },
      options?: { upgrade?: boolean }
    ): Promise<FirebaseOperationResult<Na3StdDocument>> => {
      if (!currentUser) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const trimmedComment = data.comment.trim();

      try {
        const eventPushRes = await pushVersionEvent(docId, {
          type: options?.upgrade ? "upgrade" : "edit",
          payload: { comment: trimmedComment },
        });

        if (eventPushRes.error) {
          return eventPushRes;
        }

        const docRef = doc(fbCollectionRef.current, docId);
        const docToModify = await getDoc(docRef);
        const currDocData = docToModify.data();
        if (!currDocData) {
          return {
            data: null,
            error: buildNa3Error("na3/firestore/generic/doc-not-found"),
          };
        }

        const docOverwrite = buildStdDocument(
          data,
          { device, user: currentUser },
          { versions: currDocData.versions, upgrade: options?.upgrade }
        );

        await updateDoc(docRef, docOverwrite);

        const updatedDoc = { ...docOverwrite, id: docId };

        const docLatestVersion = getDocumentLatestVersion(updatedDoc);
        if (!docLatestVersion) {
          return {
            data: null,
            error: buildNa3Error("na3/firestore/generic/doc-not-found"),
          };
        }

        await uploadBytes(
          ref(
            fbStorageRef.current,
            buildStdDocumentUrl(updatedDoc, docLatestVersion)
          ),
          data.file
        );

        const eventData = { docId, comment: trimmedComment };
        if (options?.upgrade) {
          void currentUser.registerEvents({ DOCS_STD_UPGRADE: eventData });
        } else {
          void currentUser.registerEvents({ DOCS_STD_EDIT: eventData });
        }

        return { data: updatedDoc, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [currentUser, device, getDocumentLatestVersion, pushVersionEvent]
  );

  const editDocumentVersion = useCallback(
    async (
      docId: string,
      data: StdDocBuilderData & { comment: string; file: File }
    ) => modifyDocument(docId, data, { upgrade: false }),
    [modifyDocument]
  );

  const upgradeDocument = useCallback(
    async (
      docId: string,
      data: StdDocBuilderData & { comment: string; file: File }
    ) => modifyDocument(docId, data, { upgrade: true }),
    [modifyDocument]
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
      getDocumentLatestApprovedVersion,
      getDocumentLatestVersionForUser,
      getDocumentVersionStatus,
      getDocumentStatus,
      checkDocumentIsOutdated,
      checkDocumentHasBeenReleased,
      checkDocumentRequiresAcknowledgement,
      checkDocumentIsUpgrading,
      getDocumentAcknowledgedUsers,
      getUserAcknowledgment,
      getDocumentDownloads,
      getUserDownloads,
      getDocumentVersionDownloadUrl,
      userHasDocumentPermissions,
      getDocumentActions,
      getUserPermissionsForDocument,
      registerAcknowledgment,
      registerDownload,
      approveDocumentVersion,
      rejectDocumentVersion,
      editDocumentVersion,
      upgradeDocument,
    },
  };
}
