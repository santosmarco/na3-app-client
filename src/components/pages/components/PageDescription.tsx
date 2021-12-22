import { Text } from "@components";
import type { Typography } from "antd";
import React from "react";

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
  return (
    <Text
      block={true}
      className={className}
      ellipsis={ellipsis}
      italic={true}
      maxLines={1}
      type="secondary"
      variant="paragraph"
    >
      {children}
    </Text>
  );
}
