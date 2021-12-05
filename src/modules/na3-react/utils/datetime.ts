import dayjs from "dayjs";

export function timestamp(): string {
  return dayjs().format();
}

export function formatMilliseconds(ms: number): string {
  if (ms === 0) {
    return "—";
  }

  const duration = dayjs.duration(ms, "ms");

  return `${
    Math.floor(duration.asHours()) === 0
      ? ""
      : `${Math.floor(duration.asHours())}h`
  }${duration.minutes() === 0 ? "" : `${duration.minutes()}m`}${
    duration.seconds() === 0 ? "" : `${duration.seconds()}s`
  }`;
}
