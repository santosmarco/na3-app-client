import type { Na3AppDevice } from "@modules/na3-types";
import type { NullableDeep } from "@types";

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function deviceToString({
  name,
  model,
  os,
}: NullableDeep<Na3AppDevice>): string | undefined {
  if (!(name && model && os?.version)) return;
  return `${name} – ${model} (v${os?.version})`;
}
