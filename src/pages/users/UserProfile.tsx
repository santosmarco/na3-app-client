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
import { useBreadcrumb } from "@hooks";
import { useCurrentUser } from "@modules/na3-react";
import { useNa3Users } from "@modules/na3-react";
import { Button, Grid, Typography } from "antd";
import React, { useEffect, useMemo } from "react";

import classes from "./UserProfile.module.css";

type PageProps = { fromAdmin?: boolean } & (
  | {
      asAccountPage: true;
      registrationId?: never;
    }
  | {
      asAccountPage?: never;
      registrationId: string;
    }
);

export function UserProfilePage({
  registrationId,
  asAccountPage,
  fromAdmin,
}: PageProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();

  const {
    helpers: { getByRegistrationId: getUserByRegistrationId },
    loading,
  } = useNa3Users();
  const currentUser = useCurrentUser();

  const user = useMemo(
    () =>
      asAccountPage
        ? currentUser
        : registrationId
        ? getUserByRegistrationId(registrationId)
        : undefined,
    [asAccountPage, currentUser, getUserByRegistrationId, registrationId]
  );

  useEffect(() => {
    setBreadcrumbExtra(fromAdmin && user?.fullName);
  }, [setBreadcrumbExtra, user, fromAdmin]);

  return user ? (
    <>
      <div className={classes.ProfileHeader}>
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

            {(asAccountPage || fromAdmin) && (
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
            )}
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
            label={asAccountPage ? "Suas posições" : "Posições"}
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
          editable={
            asAccountPage && {
              onChange: (): void => {
                return;
              },
              autoSize: { maxRows: 5, minRows: 3 },
            }
          }
        >
          {user.bio || (
            <em>
              {asAccountPage ? "Você" : "Este usuário"} ainda não definiu sua
              bio.
            </em>
          )}
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
        label={asAccountPage ? "Suas conquistas" : "Conquistas"}
      >
        <AccountAchievements />
      </DataItem>
    </>
  ) : (
    <Result404
      backBtnLabel={asAccountPage ? "Entrar" : undefined}
      backUrl={asAccountPage ? "/entrar" : "/"}
      isLoading={loading}
    >
      {asAccountPage
        ? "Você precisa entrar primeiro."
        : "O usuário requisitado não existe ou foi desabilitado."}
    </Result404>
  );
}
