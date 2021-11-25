import type { Dayjs } from "dayjs";

import type {
  Na3Department,
  Na3Position,
  Na3User,
  Na3UserPrivilegeId,
} from "../../../na3-types";

export type AppUserBase = Omit<
  Na3User,
  "createdAt" | "positionIds" | "positions" | "style" | "updatedAt"
> & {
  readonly createdAt: Dayjs;
  readonly departments: Na3Department[];
  readonly positions: Na3Position[];
  readonly privileges: Na3UserPrivilegeId[];
  readonly style: {
    readonly backgroundColor: string;
    readonly color: string;
  };
  readonly updatedAt: Dayjs;
};
