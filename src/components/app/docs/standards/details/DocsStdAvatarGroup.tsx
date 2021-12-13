import type { UserAvatarProps } from "@components";
import { UserAvatarGroup } from "@components";
import type { AppUser } from "@modules/na3-react";
import type { Na3StdDocumentEvent } from "@modules/na3-types";
import { timestampToStr } from "@utils";
import { Typography } from "antd";
import React, { useCallback } from "react";

type AvatarGroupData = { user: AppUser; event: Na3StdDocumentEvent };

type DocsStdAvatarGroupProps = {
  data: AvatarGroupData[];
};

export function DocsStdAvatarGroup({
  data,
}: DocsStdAvatarGroupProps): JSX.Element {
  const handleTooltip = useCallback(
    (data: AvatarGroupData): UserAvatarProps["tooltip"] => ({
      content: (
        <>
          <div>
            <Typography.Text strong={true}>
              {data.user.compactDisplayName}
            </Typography.Text>
          </div>
          <Typography.Text italic={true}>
            em {timestampToStr(data.event.timestamp)}
          </Typography.Text>
        </>
      ),
      placement: "topLeft",
      arrowPointAtCenter: true,
    }),
    []
  );

  return (
    <UserAvatarGroup
      data={data}
      maxCount={5}
      onTooltipProps={handleTooltip}
      type="initials"
    />
  );
}
