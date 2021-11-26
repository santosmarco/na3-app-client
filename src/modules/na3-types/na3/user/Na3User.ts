import type { Na3PositionId } from "../Na3Position";
import type { Na3UserEvent } from "./Na3UserEvent";

export type Na3User = {
  readonly activityHistory: Na3UserEvent[];
  readonly bio: string | null;
  readonly createdAt: string;
  readonly displayName: string;
  readonly email: string | null;
  readonly firstName: string;
  readonly id: string;
  readonly isActive: boolean;
  readonly isEmailVerified: boolean;
  readonly isPasswordDefault: boolean;
  readonly isSuper: boolean;
  readonly lastName: string;
  readonly lastSeenAt: string;
  readonly middleName: string | null;
  readonly notificationTokens: string[];
  readonly photoUrl: string | null;
  readonly positionIds: Na3PositionId[];
  readonly registrationId: string;
  readonly style: {
    readonly backgroundColor: string | null;
    readonly color: string | null;
  };
  readonly updatedAt: string;
};
