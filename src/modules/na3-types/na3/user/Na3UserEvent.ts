import type { ReadonlyDeep } from "type-fest";

type Na3UserEventType = "SERVICE_ORDER_CREATE";

type Na3UserEventBase<
  Type extends Na3UserEventType,
  Data extends Record<string, unknown>
> = {
  readonly data: ReadonlyDeep<Data>;
  readonly fromId: string;
  readonly id: string;
  readonly timestamp: string;
  readonly type: Type;
};

type ServiceOrderCreate = Na3UserEventBase<
  "SERVICE_ORDER_CREATE",
  { id: string }
>;

export type Na3UserEvent = ServiceOrderCreate;
