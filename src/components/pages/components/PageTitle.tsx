import { LeftOutlined } from "@ant-design/icons";
import { Divider } from "@components";
import { Button, Grid, Typography } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import classes from "./PageTitle.module.css";

type PageTitleProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  pre?: React.ReactNode;
};

const defaultProps: PageTitleProps = {
  children: null,
  icon: null,
  pre: null,
};

export function PageTitle({
  icon,
  pre,
  children,
}: PageTitleProps): JSX.Element {
  const history = useHistory();

  const breakpoint = Grid.useBreakpoint();

  const handleNavigateBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div>
      {!breakpoint.md && (
        <Button
          className={classes.BackButton}
          icon={<LeftOutlined />}
          onClick={handleNavigateBack}
          size="small"
          type="link"
        >
          Voltar
        </Button>
      )}

      <Divider icon={icon} marginTop={0} pre={pre}>
        {children}
      </Divider>
    </div>
  );
}

PageTitle.defaultProps = defaultProps;
