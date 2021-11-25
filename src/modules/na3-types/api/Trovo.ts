import type { FixedLengthArray } from "type-fest";

export type TrovoApiError = {
  code: string;
  message: string;
};

export type TrovoApiResponse<T> =
  | { data: null; error: TrovoApiError }
  | { data: T; error: null };

export type TrovoApiQrSlotEmpty = { empty: true; scanId: null; uid: null };

export type TrovoApiQrSlotFulfilled = {
  empty: false;
  scanId: string;
  uid: string;
};

export type TrovoApiQrSlot<IsEmpty extends boolean | undefined = undefined> =
  IsEmpty extends true
    ? TrovoApiQrSlotEmpty
    : IsEmpty extends false
    ? TrovoApiQrSlotFulfilled
    : TrovoApiQrSlotEmpty | TrovoApiQrSlotFulfilled;

export type TrovoApiQrScan = {
  scanId: string;
  scannedAt: string;
  successful: boolean;
};

export type TrovoApiQr<IsEmpty extends boolean | undefined = undefined> = {
  generatedAt: string;
  id: string;
  registeredAt: IsEmpty extends true
    ? null
    : IsEmpty extends false
    ? string
    : string | null;
  registeredBy: IsEmpty extends true
    ? null
    : IsEmpty extends false
    ? string
    : string | null;
  scans: IsEmpty extends true
    ? []
    : IsEmpty extends false
    ? TrovoApiQrScan[] & { 0: TrovoApiQrScan }
    : TrovoApiQrScan[];
  slots: FixedLengthArray<TrovoApiQrSlot<IsEmpty>, 5>;
};
