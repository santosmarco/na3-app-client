import { LeftOutlined } from "@ant-design/icons";
import { Divider } from "@components";
import { PARAGRAPH_MARGIN_BOTTOM } from "@constants";
import { Button, Grid, Tooltip } from "antd";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import classes from "./PageTitle.module.css";

type PageTitleProps = {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  marginBottom?: number | "paragraph";
  pre?: React.ReactNode;
  style?: React.CSSProperties;
  tooltip?: React.ReactNode;
};

export function PageTitle({
  icon,
  pre,
  children,
  tooltip,
  className,
  marginBottom,
  style: styleProp,
}: PageTitleProps): JSX.Element {
  const history = useHistory();

  const breakpoint = Grid.useBreakpoint();

  const containerStyle = useMemo(
    () => ({
      ...styleProp,
      marginBottom:
        marginBottom === "paragraph"
          ? PARAGRAPH_MARGIN_BOTTOM
          : marginBottom ?? styleProp?.marginBottom,
    }),
    [styleProp, marginBottom]
  );

  const handleNavigateBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div className={className} style={containerStyle}>
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
        <Tooltip
          placement="topLeft"
          title={typeof tooltip === "string" ? <em>{tooltip}</em> : tooltip}
          visible={tooltip ? undefined : false}
        >
          {children}
        </Tooltip>
      </Divider>
    </div>
  );
}
