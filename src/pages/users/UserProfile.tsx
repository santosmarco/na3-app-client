import {
  HeartOutlined,
  SettingOutlined,
  TrophyOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  AccountAchievements,
  AccountLastSeen,
  AccountRegistrationId,
  AchievementScoreTag,
  DataItem,
  Divider,
  Page,
  Result404,
  UserAvatar,
  UserDisplayName,
  UserPositionTag,
} from "@components";
import { useBreadcrumb } from "@hooks";
import { useCurrentUser, useNa3Users } from "@modules/na3-react";
import { isTouchDevice } from "@utils";
import { Button, Grid, notification, Typography } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";

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
    helpers: {
      getByRegistrationId: getUserByRegistrationId,
      setCurrentUserBio,
    },
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

  const handleUserBioUpdate = useCallback(
    async (updatedBio: string) => {
      const operationRes = await setCurrentUserBio(updatedBio);

      if (operationRes.error) {
        notification.error({
          description: operationRes.error.message,
          message: "Erro ao atualizar bio",
        });
      }
    },
    [setCurrentUserBio]
  );

  useEffect(() => {
    setBreadcrumbExtra(fromAdmin && user?.fullName);
  }, [setBreadcrumbExtra, user, fromAdmin]);

  return user ? (
    <>
      <div className={classes.ProfileHeader}>
        <UserAvatar
          size="large"
          tooltip={{
            content: <AccountLastSeen at={user.lastSeenAt} />,
            placement: "bottomLeft",
            small: true,
          }}
          type="initials"
          user={user}
          wrapperClassName={classes.Avatar}
        />

        <div className={classes.HeaderContent}>
          <div className={classes.HeaderContentMain}>
            <UserDisplayName
              className={classes.DisplayName}
              level={4}
              showUidOnHover={fromAdmin}
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
        marginBottom={breakpoint.lg ? undefined : 16}
        marginTop={breakpoint.lg ? undefined : 16}
      />

      <Page scrollTopOffset={breakpoint.lg ? 24 : 16}>
        {!breakpoint.lg && (
          <>
            <DataItem
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
          icon={<HeartOutlined />}
          iconMarginRight={4}
          label="Bio"
        >
          <Typography.Paragraph
            editable={
              asAccountPage && {
                onChange: handleUserBioUpdate,
                autoSize: { maxRows: 5, minRows: 3 },
                tooltip: `${isTouchDevice() ? "Toque" : "Clique"} para editar`,
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
          icon={<TrophyOutlined />}
          iconMarginRight={4}
          label={asAccountPage ? "Suas conquistas" : "Conquistas"}
          right={
            <AchievementScoreTag
              achieved={user.score.current === user.score.total}
              score={user.score.current}
              total={user.score.total}
            />
          }
        >
          <AccountAchievements achievements={user.achievements} />
        </DataItem>
      </Page>
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
