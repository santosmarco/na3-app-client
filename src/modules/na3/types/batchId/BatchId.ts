export type BatchIdType = "brazil" | "commercial" | "invalid" | "mexico";

export type BatchId = {
  readonly hasBeenFixed: boolean;
  readonly isBrazilian: boolean;
  readonly isCommercial: boolean;
  readonly isMexican: boolean;
  readonly isValid: boolean;
  readonly originalValue: string;
  readonly type: BatchIdType;
  readonly value: string;
};
