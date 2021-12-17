import { LeftOutlined } from "@ant-design/icons";
import { Button, Grid, Typography } from "antd";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import classes from "./PdfViewerToolbarHeader.module.css";

type PdfViewerToolbarHeaderProps = {
  docTitle: string;
  docVersion?: number;
  onNavigateBack?: (() => void) | null;
};

export function PdfViewerToolbarHeader({
  docTitle,
  docVersion,
  onNavigateBack,
}: PdfViewerToolbarHeaderProps): JSX.Element {
  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const docTitleEllipsisConfig = useMemo(() => ({ rows: 1 }), []);

  const backBtnStyle = useMemo(
    () => ({
      paddingLeft: breakpoint.md ? 5 : 2,
    }),
    [breakpoint.md]
  );

  const docVersionStyle = useMemo(
    () => ({
      marginRight: breakpoint.md ? 7 : 4,
    }),
    [breakpoint.md]
  );

  const handleNavigateBackDefault = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div className={classes.ToolbarHeader}>
      <Button
        icon={<LeftOutlined />}
        onClick={onNavigateBack || handleNavigateBackDefault}
        size={breakpoint.md ? "middle" : "small"}
        style={backBtnStyle}
        type="link"
      >
        Voltar
      </Button>

      <Typography.Paragraph
        className={classes.ToolbarDocTitle}
        ellipsis={docTitleEllipsisConfig}
      >
        {docTitle}
      </Typography.Paragraph>

      <Typography.Text italic={true} style={docVersionStyle}>
        v{docVersion || "—"}
      </Typography.Text>
    </div>
  );
}
