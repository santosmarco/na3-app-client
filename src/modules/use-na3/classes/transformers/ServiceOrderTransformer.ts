import type { AppUser, AppUserAuthenticated } from "@modules/na3-react";
import type {
  Na3MaintenancePerson,
  Na3ServiceOrder,
  Na3ServiceOrderEvent,
  Na3ServiceOrderEventType,
  Na3ServiceOrderStatus,
  Na3User,
  Na3UserEventData,
} from "@modules/na3-types";
import dayjs from "dayjs";
import type { DocumentReference } from "firebase/firestore";
import { nanoid } from "nanoid";

import type {
  MaybeArray,
  Na3ServiceOrderConfirmEventPayload,
  Na3ServiceOrderEventBuilderConfig,
  Na3ServiceOrderEventBuilderOptions,
  Na3ServiceOrderEventBuilderOrigin,
  Na3ServiceOrderTransformerEventOrigin,
  ServiceOrderTransformer as IServiceOrderTransformer,
  TransformerResult,
} from "../../types";
import { arrayUnion, isArray, timestamp } from "../../utils";
import { TransformerError } from "../errors/TransformerError";
import { Transformer } from "./Transformer";

class ServiceOrderTransformer
  extends Transformer<Na3ServiceOrder>
  implements IServiceOrderTransformer
{
  includesStatus(status: MaybeArray<Na3ServiceOrderStatus>): boolean {
    const statusArr = isArray(status) ? [...status] : [status];

    return statusArr.includes(this.data.status);
  }

  getLatestEventOfType(
    type: Na3ServiceOrderEventType
  ): Na3ServiceOrderEvent | undefined {
    const events = [...this.data.events];
    const validEvents = events.filter((ev) => ev.type === type);

    return validEvents.pop();
  }

  isFromUserDepartment(user: AppUser): boolean {
    return user.includesDepartments(this.data.username);
  }

  checkRequiresUserAction(user: AppUser): boolean {
    if (user.hasPrivileges("service_orders_write_shop_floor")) {
      if (this.includesStatus("solved") && this.isFromUserDepartment(user)) {
        return true;
      }
    } else if (user.hasPrivileges("service_orders_write_maintenance")) {
      if (this.includesStatus(["pending", "solving"])) {
        return true;
      }
    }

    return false;
  }

  calculateMsBetweenEvents(
    eventBefore: Na3ServiceOrderEvent,
    eventAfter?: Na3ServiceOrderEvent
  ): number {
    const { timestamp: timestampBefore } = eventBefore;
    const timestampAfter = eventAfter?.timestamp || timestamp();

    return dayjs(timestampAfter).diff(dayjs(timestampBefore));
  }

  async acceptSolutionAsync(
    eventOrigin: Na3ServiceOrderTransformerEventOrigin
  ): Promise<TransformerResult<this>> {
    try {
      await this.updateAsync({
        closedAt: timestamp(),
        status: "closed",
        events: arrayUnion(
          this.buildEvents(
            [
              { type: "solutionAccepted" },
              { type: "ticketClosed" },
              {
                payload: { solutionStep: { type: "solutionAccepted" } },
                type: "solutionStepAdded",
              },
            ],
            eventOrigin
          )
        ),
      });

      void this.registerAcceptSolutionAsync(eventOrigin.user);

      return this.buildResultOk(this);
    } catch (err) {
      return this.handleResultError(err);
    }
  }

  async confirmAsync(
    eventPayload: Na3ServiceOrderConfirmEventPayload,
    eventOrigin: Na3ServiceOrderTransformerEventOrigin
  ): Promise<TransformerResult<this>> {
    const { assignee, priority } = eventPayload;

    const assigneeAsMaintPerson =
      this.transformUserToMaintenancePerson(assignee);

    try {
      await this.updateAsync({
        acceptedAt: timestamp(),
        assignedMaintainer: assigneeAsMaintPerson,
        priority: priority,
        status: "solving",
        events: arrayUnion(
          this.buildEvents(
            {
              payload: {
                assignedMaintainer: assigneeAsMaintPerson,
                priority: priority,
              },
              type: "ticketConfirmed",
            },
            eventOrigin
          )
        ),
      });

      void this.registerConfirmAsync(eventOrigin.user, eventPayload);

      return this.buildResultOk(this);
    } catch (err) {
      return this.handleResultError(err);
    }
  }

  async registerAcceptSolutionAsync(
    user: AppUserAuthenticated
  ): Promise<TransformerResult<ServiceOrderTransformer>> {
    try {
      const latestDeliverEv = this.getLatestEventOfType("solutionTransmitted");

      if (!latestDeliverEv) {
        throw new TransformerError(
          "service-orders/latest-deliver-ev-not-found"
        );
      }

      const msPastSinceDelivery =
        this.calculateMsBetweenEvents(latestDeliverEv);

      const userEv: Na3UserEventData<"SERVICE_ORDER_ACCEPT_SOLUTION"> = {
        id: this.data.id,
        msFromDeliver: msPastSinceDelivery,
      };

      await user.registerEvents({ SERVICE_ORDER_ACCEPT_SOLUTION: userEv });

      return this.buildResultOk(this);
    } catch (err) {
      return this.handleResultError(err);
    }
  }

  async registerConfirmAsync(
    user: AppUserAuthenticated,
    eventPayload: Na3ServiceOrderConfirmEventPayload
  ): Promise<TransformerResult<ServiceOrderTransformer>> {
    const { assignee, priority } = eventPayload;

    const userEv: Na3UserEventData<"SERVICE_ORDER_CONFIRM"> = {
      id: this.data.id,
      assigneeUid: assignee.uid,
      priority,
    };

    try {
      await user.registerEvents({ SERVICE_ORDER_CONFIRM: userEv });

      return this.buildResultOk(this);
    } catch (err) {
      return this.handleResultError(err);
    }
  }

  private transformUserToMaintenancePerson(
    user: AppUser | AppUserAuthenticated | Na3MaintenancePerson | Na3User
  ): Na3MaintenancePerson {
    return {
      displayName: user.displayName,
      uid: user.uid,
    };
  }

  private buildOneEvent(
    eventConfig: Na3ServiceOrderEventBuilderConfig,
    eventOrigin: Na3ServiceOrderEventBuilderOrigin,
    options?: Na3ServiceOrderEventBuilderOptions
  ): Na3ServiceOrderEvent {
    const { type, payload } = eventConfig;
    const { user, device } = eventOrigin;

    return {
      id: nanoid(),
      type: type,
      payload: payload || null,
      timestamp: options?.timestamp || timestamp(),
      user: this.transformUserToMaintenancePerson(user),
      device: device,
    };
  }

  private buildEvents(
    eventConfig: Na3ServiceOrderEventBuilderConfig,
    origin: Na3ServiceOrderEventBuilderOrigin
  ): Na3ServiceOrderEvent;
  private buildEvents(
    eventConfigs: Na3ServiceOrderEventBuilderConfig[],
    origin: Na3ServiceOrderEventBuilderOrigin
  ): Na3ServiceOrderEvent[];
  private buildEvents(
    eventConfigOrConfigs: MaybeArray<Na3ServiceOrderEventBuilderConfig>,
    origin: Na3ServiceOrderEventBuilderOrigin
  ): MaybeArray<Na3ServiceOrderEvent> {
    if (isArray(eventConfigOrConfigs)) {
      return eventConfigOrConfigs.map((eventConfig) =>
        this.buildOneEvent(eventConfig, origin, { timestamp: timestamp() })
      );
    }
    return this.buildOneEvent(eventConfigOrConfigs, origin);
  }
}

export function transformServiceOrder(
  data: Na3ServiceOrder,
  ref: DocumentReference<Na3ServiceOrder>
): ServiceOrderTransformer {
  return new ServiceOrderTransformer(data, ref);
}
