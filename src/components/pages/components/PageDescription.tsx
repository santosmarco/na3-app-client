import { Typography } from "antd";
import React, { useMemo } from "react";

type EllipsisConfig = Exclude<
  React.ComponentProps<typeof Typography["Paragraph"]>["ellipsis"],
  boolean | undefined
>;

type PageDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
  ellipsis?: EllipsisConfig | null;
};

export function PageDescription({
  children,
  className,
  ellipsis,
}: PageDescriptionProps): JSX.Element {
  const ellipsisConfig = useMemo(
    () => (ellipsis ? ellipsis : { rows: 1, expandable: true, symbol: "mais" }),
    [ellipsis]
  );

  return (
    <Typography.Paragraph
      className={className}
      ellipsis={ellipsisConfig}
      italic={true}
      type="secondary"
    >
      {children}
    </Typography.Paragraph>
  );
}
