import { LeftOutlined } from "@ant-design/icons";
import { Button, Grid, Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./PdfViewerToolbarHeader.module.css";

type PdfViewerToolbarHeaderProps = {
  docTitle: string;
  docVersion?: number;
};

export function PdfViewerToolbarHeader({
  docTitle,
  docVersion,
}: PdfViewerToolbarHeaderProps): JSX.Element {
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

  return (
    <div className={classes.ToolbarHeader}>
      <Button
        icon={<LeftOutlined />}
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
        TesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTesteTeste
      </Typography.Paragraph>

      <Typography.Text italic={true} style={docVersionStyle}>
        {docVersion ? `v${docVersion}` : null}
      </Typography.Text>
    </div>
  );
}
