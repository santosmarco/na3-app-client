import type { WebColor } from "../utils";
import type { Na3AppDevice } from "./Na3App";
import type { Na3PositionId } from "./Na3Position";

export type Na3StdDocumentTypeId =
  | "form"
  | "instructions"
  | "manual"
  | "procedure";

export type Na3StdDocumentType = {
  color: WebColor;
  id: Na3StdDocumentTypeId;
  name: string;
  shortName: string;
};

export type Na3StdDocumentPermissions = {
  approve: Na3PositionId[];
  download: Na3PositionId[];
  print: Na3PositionId[];
  read: Na3PositionId[];
};

export type Na3StdDocumentVersion = {
  approvedAt: string | null;
  approvedByUid: string | null;
  createdAt: string;
  id: string;
  number: number;
};

export type Na3StdDocumentEventOrigin = { device: Na3AppDevice; uid: string };

export type Na3StdDocumentEvent = {
  id: string;
  origin: Na3StdDocumentEventOrigin;
  timestamp: string;
} & { payload: null; type: "create" };

export type Na3StdDocument = {
  code: string;
  description: string;
  events: Na3StdDocumentEvent[];
  id: string;
  nextRevisionAt: string;
  permissions: Na3StdDocumentPermissions;
  timeBetweenRevisionsMs: number;
  title: string;
  type: Na3StdDocumentType;
  versions: Na3StdDocumentVersion[];
};
