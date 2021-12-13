import { Button, Grid, Tooltip } from "antd";
import React from "react";

type PdfViewerToolbarButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  labelPlacement?: "left" | "center" | "right";
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
      title={label}
      placement={
        labelPlacement === "left"
          ? "bottomLeft"
          : labelPlacement === "right"
          ? "bottomRight"
          : "bottom"
      }
    >
      <Button
        type="text"
        size={breakpoint.md ? "middle" : "small"}
        icon={icon}
        onClick={onClick}
        disabled={disabled}
      />
    </Tooltip>
  );
}
