import { CoffeeOutlined, HeartOutlined } from "@ant-design/icons";
import {
  AccountAvatar,
  AccountName,
  AccountPositionTag,
  DataItem,
  Divider,
  Result404,
} from "@components";
import { useCurrentUser } from "@modules/na3-react";
import { Grid, Space, Typography } from "antd";
import React from "react";

import classes from "./UserAccount.module.css";

export function UserAccountPage(): JSX.Element {
  const user = useCurrentUser();

  const breakpoint = Grid.useBreakpoint();

  return user ? (
    <>
      <div className={classes.AccountHeader}>
        <Space size="large">
          <Space size="middle">
            <AccountAvatar user={user} />
            <AccountName user={user} />
          </Space>

          {breakpoint.lg && (
            <Space>
              {user.positions.map((pos) => (
                <AccountPositionTag key={pos.id} position={pos} />
              ))}
            </Space>
          )}
        </Space>

        {breakpoint.lg && (
          <div>
            <Typography.Text italic={true} type="secondary">
              desde {user.createdAt.format("DD/MM/YYYY")}
            </Typography.Text>
          </div>
        )}
      </div>

      <Divider
        marginBottom={!breakpoint.lg ? 16 : undefined}
        marginTop={!breakpoint.lg ? 16 : undefined}
      />

      {!breakpoint.lg && (
        <>
          <DataItem
            className={classes.PositionsMobile}
            icon={<CoffeeOutlined />}
            label="Suas posições"
          >
            <Space>
              {user.positions.map((pos) => (
                <AccountPositionTag key={pos.id} position={pos} />
              ))}
            </Space>
          </DataItem>

          <Divider />
        </>
      )}

      <DataItem
        className={classes.PositionsMobile}
        icon={<HeartOutlined />}
        label="Bio"
      >
        <Typography.Paragraph
          editable={{
            onChange: (text): void => console.log(text),
            autoSize: { maxRows: 5, minRows: 3 },
          }}
        >
          {user.bio || <em>Você ainda não definiu uma bio.</em>}
        </Typography.Paragraph>
      </DataItem>
    </>
  ) : (
    <Result404 backBtnLabel="Entrar" backUrl="/entrar" isLoading={false}>
      Você precisa entrar primeiro.
    </Result404>
  );
}
