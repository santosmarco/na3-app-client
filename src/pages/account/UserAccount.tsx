import {
  HeartOutlined,
  SettingOutlined,
  TrophyOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  AccountAchievements,
  AccountRegistrationId,
  DataItem,
  Divider,
  Result404,
  UserAvatar,
  UserDisplayName,
  UserPositionTag,
} from "@components";
import { useCurrentUser } from "@modules/na3-react";
import { Button, Grid, Typography } from "antd";
import React from "react";

import classes from "./UserAccount.module.css";

export function UserAccountPage(): JSX.Element {
  const user = useCurrentUser();

  const breakpoint = Grid.useBreakpoint();

  return user ? (
    <>
      <div className={classes.AccountHeader}>
        <UserAvatar
          size="large"
          type="initials"
          user={user}
          wrapperClassName={classes.Avatar}
        />

        <div className={classes.HeaderContent}>
          <div className={classes.HeaderContentMain}>
            <UserDisplayName
              className={classes.DisplayName}
              level={4}
              user={user}
            />

            {breakpoint.lg && <UserPositionTag position={user.positions} />}

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
            <AccountRegistrationId>{user.registrationId}</AccountRegistrationId>
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
            <UserPositionTag position={user.positions} />
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
            onChange: (): void => {
              return;
            },
            autoSize: { maxRows: 5, minRows: 3 },
          }}
        >
          {user.bio || <em>Você ainda não definiu sua bio.</em>}
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
