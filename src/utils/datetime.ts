import dayjs from "dayjs";

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
  includeSeconds?: boolean;
};

type HumanizeDurationOptions = {
  noSuffix?: boolean;
};

export function timestamp(): string {
  return dayjs().format();
}

export function timestampToStr(
  timestamp: DayjsInput,
  options?: TimestampToStrOptions
): string {
  return dayjs(timestamp).format(
    `DD/MM/YY [às] HH:mm${options?.includeSeconds ? ":ss" : ""}`
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
