import {
  HeartOutlined,
  SettingOutlined,
  TrophyOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  AccountAchievements,
  AccountAvatar,
  AccountDisplayName,
  AccountLastSeen,
  AccountPositionTag,
  AccountRegistrationId,
  DataItem,
  Divider,
  Result404,
} from "@components";
import { useCurrentUser } from "@modules/na3-react";
import { Button, Grid, Space, Typography } from "antd";
import React from "react";

import classes from "./UserAccount.module.css";

export function UserAccountPage(): JSX.Element {
  const user = useCurrentUser();

  const breakpoint = Grid.useBreakpoint();

  return user ? (
    <>
      <div className={classes.AccountHeader}>
        <AccountAvatar className={classes.Avatar} user={user} />

        <div className={classes.HeaderContent}>
          <div className={classes.HeaderContentMain}>
            <AccountDisplayName className={classes.DisplayName}>
              {user.displayName}
            </AccountDisplayName>

            {breakpoint.lg && (
              <Space>
                {user.positions.map((pos) => (
                  <AccountPositionTag key={pos.id} position={pos} />
                ))}
              </Space>
            )}

            <div className={classes.HeaderRight}>
              <Button
                className={classes.SettingsButton}
                icon={<SettingOutlined />}
                shape={breakpoint.lg ? undefined : "circle"}
                type="text"
              >
                {breakpoint.lg && "Ajustes"}
              </Button>
            </div>
          </div>

          <div className={classes.HeaderSub}>
            <Space size={1} split={<Divider type="vertical" />}>
              <>
                <AccountRegistrationId>
                  {user.registrationId}
                </AccountRegistrationId>

                {breakpoint.lg && <AccountLastSeen at={user.lastSeenAt} />}
              </>
            </Space>
          </div>
        </div>
      </div>

      <Divider
        marginBottom={!breakpoint.lg ? 16 : undefined}
        marginTop={!breakpoint.lg ? 16 : undefined}
      />

      {!breakpoint.lg && (
        <>
          <DataItem
            className={classes.DataItem}
            hasColon={false}
            icon={<UserSwitchOutlined />}
            iconMarginRight={4}
            label="Suas posições"
          >
            <Space>
              {user.positions.map((pos) => (
                <AccountPositionTag key={pos.id} position={pos} />
              ))}
            </Space>
          </DataItem>

          <Divider marginBottom={16} />
        </>
      )}

      <DataItem
        className={classes.DataItem}
        hasColon={false}
        icon={<HeartOutlined />}
        iconMarginRight={4}
        label="Bio"
      >
        <Typography.Paragraph
          editable={{
            onChange: (text): void => console.log(text),
            autoSize: { maxRows: 5, minRows: 3 },
          }}
        >
          {user.bio || <em>Você ainda não definiu sua bio</em>}
        </Typography.Paragraph>
      </DataItem>

      <Divider
        marginBottom={!breakpoint.lg ? 16 : undefined}
        marginTop={!breakpoint.lg ? 16 : undefined}
      />

      <DataItem
        className={classes.DataItem}
        hasColon={false}
        icon={<TrophyOutlined />}
        iconMarginRight={4}
        label="Suas conquistas"
      >
        <AccountAchievements />
      </DataItem>
    </>
  ) : (
    <Result404 backBtnLabel="Entrar" backUrl="/entrar" isLoading={false}>
      Você precisa entrar primeiro.
    </Result404>
  );
}
