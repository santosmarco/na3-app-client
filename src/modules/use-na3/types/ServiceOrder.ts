import type { AppUser, AppUserAuthenticated } from "@modules/na3-react";
import type {
  Na3AppDevice,
  Na3ServiceOrderEvent,
  Na3ServiceOrderEventPayload,
  Na3ServiceOrderEventType,
  Na3ServiceOrderPriority,
  Na3ServiceOrderStatus,
  Na3User,
} from "@modules/na3-types";

import type { TransformerResult } from "./Transformer";
import type { MaybeArray } from "./utils";

export type Na3ServiceOrderTransformerEventOrigin = {
  device: Na3AppDevice;
  user: AppUserAuthenticated;
};

export type Na3ServiceOrderEventBuilderConfig = {
  payload?: Na3ServiceOrderEventPayload;
  type: Na3ServiceOrderEventType;
};

export type Na3ServiceOrderEventBuilderOrigin =
  Na3ServiceOrderTransformerEventOrigin;

export type Na3ServiceOrderEventBuilderOptions = {
  timestamp?: string;
};

export type Na3ServiceOrderConfirmEventPayload = {
  assignee: Na3User;
  priority: NonNullable<Na3ServiceOrderPriority>;
};

export type ServiceOrderTransformer = {
  acceptSolutionAsync: (
    eventOrigin: Na3ServiceOrderTransformerEventOrigin
  ) => Promise<TransformerResult<ServiceOrderTransformer>>;
  calculateMsBetweenEvents: (
    eventBefore: Na3ServiceOrderEvent,
    eventAfter?: Na3ServiceOrderEvent
  ) => number;
  checkRequiresUserAction: (user: AppUser) => boolean;
  confirmAsync: (
    eventPayload: Na3ServiceOrderConfirmEventPayload,
    eventOrigin: Na3ServiceOrderTransformerEventOrigin
  ) => Promise<TransformerResult<ServiceOrderTransformer>>;
  getLatestEventOfType: (
    type: Na3ServiceOrderEventType
  ) => Na3ServiceOrderEvent | undefined;
  includesStatus: (status: MaybeArray<Na3ServiceOrderStatus>) => boolean;
  isFromUserDepartment: (user: AppUser) => boolean;
  registerAcceptSolutionAsync: (
    user: AppUserAuthenticated
  ) => Promise<TransformerResult<ServiceOrderTransformer>>;
  registerConfirmAsync: (
    user: AppUserAuthenticated,
    eventPayload: Na3ServiceOrderConfirmEventPayload
  ) => Promise<TransformerResult<ServiceOrderTransformer>>;
};
