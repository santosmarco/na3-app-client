import type { UserAvatarProps } from "@components";
import { UserAvatarGroup } from "@components";
import type { AppUser } from "@modules/na3-react";
import type { Na3StdDocumentEvent } from "@modules/na3-types";
import { timestampToStr } from "@utils";
import { Typography } from "antd";
import React, { useCallback } from "react";

import classes from "./DocsStdAvatarGroup.module.css";

type AvatarGroupData = AppUser | { user: AppUser; event?: Na3StdDocumentEvent };

type DocsStdAvatarGroupProps = {
  data: AvatarGroupData[];
};

export function DocsStdAvatarGroup({
  data,
}: DocsStdAvatarGroupProps): JSX.Element {
  const handleTooltip = useCallback(
    (item: AvatarGroupData): UserAvatarProps["tooltip"] => ({
      content: (
        <>
          <div>
            <Typography.Text strong={true}>
              {"user" in item
                ? item.user.compactDisplayName
                : item.compactDisplayName}
            </Typography.Text>
          </div>

          {"event" in item && item.event && (
            <Typography.Text italic={true}>
              em {timestampToStr(item.event.timestamp)}
            </Typography.Text>
          )}
        </>
      ),
      placement: "topLeft",
      arrowPointAtCenter: true,
    }),
    []
  );

  return (
    <div className={classes.Container}>
      {data.length > 0 ? (
        <UserAvatarGroup
          data={data}
          maxCount={5}
          onTooltipProps={handleTooltip}
          type="initials"
        />
      ) : (
        <Typography.Text italic={true} type="secondary">
          Nenhum usuário...
        </Typography.Text>
      )}
    </div>
  );
}
