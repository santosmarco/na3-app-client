import { Icon, Text } from "@components";
import { Tooltip } from "antd";
import React, { useCallback } from "react";

export type TableActionProps<Data extends Record<PropertyKey, unknown>> = {
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  onClick: (data: Data, index: number) => void;
  title?: React.ReactNode;
};

type TableActionInternalProps<Data extends Record<PropertyKey, unknown>> =
  Required<TableActionProps<Data>> & {
    data: Data;
    dataIndex: number;
  };

export function TableAction<T extends Record<PropertyKey, unknown>>({
  icon,
  label,
  title,
  onClick,
  disabled,
  data,
  dataIndex,
}: TableActionInternalProps<T>): JSX.Element {
  const handleClick = useCallback(() => {
    onClick(data, dataIndex);
  }, [onClick, data, dataIndex]);

  return (
    <Tooltip
      arrowPointAtCenter={true}
      placement="topRight"
      title={title}
      visible={title ? undefined : false}
    >
      <Text disabled={disabled} onClick={handleClick} variant="link">
        {icon ? <Icon label={label}>{icon}</Icon> : label}
      </Text>
    </Tooltip>
  );
}
