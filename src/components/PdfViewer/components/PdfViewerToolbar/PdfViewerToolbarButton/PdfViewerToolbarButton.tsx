import { Button, Grid, Tooltip } from "antd";
import React from "react";

type PdfViewerToolbarButtonProps = {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  labelPlacement?: "center" | "left" | "right";
  onClick: () => void;
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
