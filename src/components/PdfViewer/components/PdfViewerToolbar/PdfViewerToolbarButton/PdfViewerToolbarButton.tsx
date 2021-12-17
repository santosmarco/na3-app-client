import { Button, Grid, Tooltip } from "antd";
import React from "react";

type PdfViewerToolbarButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  labelPlacement?: "center" | "left" | "right";
  disabled?: boolean;
};

export function PdfViewerToolbarButton({
  label,
  icon,
  onClick,
  labelPlacement,
  disabled,
}: PdfViewerToolbarButtonProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  return (
    <Tooltip
      placement={
        labelPlacement === "left"
          ? "bottomLeft"
          : labelPlacement === "right"
          ? "bottomRight"
          : "bottom"
      }
      title={label}
    >
      <Button
        disabled={disabled}
        icon={icon}
        onClick={onClick}
        size={breakpoint.md ? "middle" : "small"}
        type="text"
      />
    </Tooltip>
  );
}
