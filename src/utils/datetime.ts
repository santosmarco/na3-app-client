import dayjs from "dayjs";

export function timestamp(): string {
  return dayjs().format();
}

export function timestampToStr(
  timestamp: string,
  options?: { includeSeconds?: boolean }
): string {
  return dayjs(timestamp).format(
    `DD/MM/YY [às] HH:mm${options?.includeSeconds ? ":ss" : ""}`
  );
}
