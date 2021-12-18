import dayjs from "dayjs";
import type { Timestamp } from "firebase/firestore";

const DAYJS_DURATION_UNITS = [
  "ms",
  "millisecond",
  "milliseconds",
  "s",
  "second",
  "seconds",
  "m",
  "minute",
  "minutes",
  "h",
  "hour",
  "hours",
  "d",
  "day",
  "days",
  "M",
  "month",
  "months",
  "y",
  "year",
  "years",
] as const;

export type DayjsInput = Parameters<typeof dayjs>[0];

type DayjsDuration = plugin.Duration;

type DayjsDurationUnit = typeof DAYJS_DURATION_UNITS[number];

type TimestampToStrOptions = {
  includeTime?: boolean;
  includeHours?: boolean;
  includeMinutes?: boolean;
  includeSeconds?: boolean;
};

type HumanizeDurationOptions = {
  noSuffix?: boolean;
};

export function timestamp(): string {
  return dayjs().format();
}

export function timestampToStr(
  timestamp: DayjsInput | Timestamp,
  options: TimestampToStrOptions = {
    includeTime: true,
    includeHours: true,
    includeMinutes: true,
    includeSeconds: false,
  }
): string {
  const dayjsInput =
    typeof timestamp === "object" && timestamp !== null && "toDate" in timestamp
      ? timestamp.toDate()
      : timestamp;

  return dayjs(dayjsInput).format(
    `DD/MM/YY${
      options.includeTime
        ? ` [às] ${options.includeHours ? "hh" : ""}${
            options.includeMinutes ? ":mm" : ""
          }${options.includeSeconds ? ":ss" : ""}`
        : ""
    }`
  );
}

export function humanizeDuration(
  time: number,
  unit?: DayjsDurationUnit,
  options?: HumanizeDurationOptions
): string;
export function humanizeDuration(
  from: DayjsInput,
  to?: DayjsInput,
  options?: HumanizeDurationOptions
): string;
export function humanizeDuration(
  timeOrFrom: DayjsInput | number,
  unitOrTo?: DayjsDurationUnit | DayjsInput,
  options?: HumanizeDurationOptions
): string {
  let duration: DayjsDuration;
  if (
    typeof timeOrFrom === "number" &&
    (unitOrTo === undefined || isDayjsDurationUnit(unitOrTo))
  ) {
    duration = dayjs.duration(timeOrFrom, unitOrTo);
  } else {
    duration = dayjs.duration(dayjs(timeOrFrom).diff(dayjs(unitOrTo)));
  }
  return duration.humanize(!options?.noSuffix);
}

function isDayjsDurationUnit(test: unknown): test is DayjsDurationUnit {
  return (
    typeof test === "string" && !!DAYJS_DURATION_UNITS.find((u) => u === test)
  );
}
