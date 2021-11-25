import type { Na3ApiError } from "../../../na3-types";

export type ControllerResult<T> =
  | { data: null; error: Na3ApiError }
  | { data: T; error: null };
