import dayjs from "dayjs";

export function timestamp(): string {
  return dayjs().format();
}
