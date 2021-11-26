import { PopoverSectionDivider } from "@components";
import type { Na3ServiceOrder } from "@modules/na3-types";
import React from "react";

import { UserMessages } from "./UserMessages";
import classes from "./UserPopover.module.css";
import { UserPopoverFooter } from "./UserPopoverFooter";

type UserPopoverProps = {
  hasMessages: boolean;
  onClose: () => void;
  urgentServiceOrders: Na3ServiceOrder[];
};

export function UserPopover({
  onClose,
  urgentServiceOrders,
  hasMessages,
}: UserPopoverProps): JSX.Element {
  return (
    <div className={classes.Container}>
      <UserMessages
        onActionBtnClick={onClose}
        serviceOrders={urgentServiceOrders}
      />
      <PopoverSectionDivider />
      <UserPopoverFooter isPrimary={!hasMessages} onNavigation={onClose} />
    </div>
  );
}
