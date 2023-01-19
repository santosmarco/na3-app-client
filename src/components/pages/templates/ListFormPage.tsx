import { PlusCircleOutlined } from "@ant-design/icons";
import { Divider } from "@components";
import type { ButtonProps } from "antd";
import { Button, Col, Grid, Row } from "antd";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";
import type { Falsy } from "utility-types";

import { PageActionButtons } from "../components/PageActionButtons";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import { Page } from "../Page";
import classes from "./ListFormPage.module.css";

type ListFormPageProps = {
  actions:
    | Array<{
        alwaysVisible?: boolean;
        disabled?: boolean;
        icon?: React.ReactNode;
        label: React.ReactNode;
        onClick: () => void;
        type?: ButtonProps["type"];
      }>
    | Falsy;
  description?: React.ReactNode;
  form?: React.ReactNode;
  formTitle: React.ReactNode;
  list: React.ReactNode;
  listTitle: React.ReactNode;
  title: React.ReactNode;
};

const defaultProps = {
  description: undefined,
};

export function ListFormPage({
  actions,
  form,
  formTitle,
  list,
  listTitle,
  title,
  description,
}: ListFormPageProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const rowStyle = useMemo(
    () => ({
      height: breakpoint.lg
        ? "calc(100% - 15px)"
        : actions
        ? "calc(100% - 95px)"
        : "calc(100% - 50px)",
    }),
    [breakpoint.lg, actions]
  );

  return (
    <>
      <PageTitle>{title}</PageTitle>

      {description && <PageDescription>{description}</PageDescription>}

      {actions &&
        (!breakpoint.lg || actions.some((act) => act.alwaysVisible)) && (
          <PageActionButtons>
            {actions.map(({ onClick, ...action }) => (
              <Button
                disabled={action.disabled}
                icon={action.icon || <PlusCircleOutlined />}
                key={nanoid()}
                onClick={onClick}
                type={action.type || "primary"}
              >
                {action.label}
              </Button>
            ))}
          </PageActionButtons>
        )}

      <Row gutter={28} style={rowStyle}>
        <Col
          className={classes.PageGridCol}
          lg={form ? 8 : 24}
          xl={form ? 7 : 24}
          xs={form ? 2 : 244}
          xxl={form ? 6 : 24}
        >
          <div className={classes.ListTitle}>
            <Divider>{listTitle}</Divider>
          </div>

          <Page>{list}</Page>
        </Col>

        {form && breakpoint.lg && (
          <Col className={classes.PageGridCol} lg={16} xl={17} xs={0} xxl={18}>
            <Divider>{formTitle}</Divider>

            <Page additionalPaddingBottom={24} scrollTopOffset={16}>
              {form}
            </Page>
          </Col>
        )}
      </Row>
    </>
  );
}

ListFormPage.defaultProps = defaultProps;
