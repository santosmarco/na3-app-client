import { TABLE_LOCALE } from "@constants";
import { useId } from "@hooks";
import type { MaybeArray } from "@types";
import { handleFilterFalsies, isArray } from "@utils";
import type { TableColumnsType, TableProps as AntdTableProps } from "antd";
import { Space, Table as AntdTable } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useMemo } from "react";
import type { Falsy } from "utility-types";

import classes from "./Table.module.css";
import type { TableActionProps } from "./TableAction";
import { TableAction } from "./TableAction";

type AntdTableColumn<T> = TableColumnsType<T>[number];

export type TableColumnPropsFn<
  Data extends Record<PropertyKey, unknown>,
  DataIndex extends number | undefined = number,
  Return = React.ReactNode
> = (data: Data, index: DataIndex) => Return;

type TableColumnFilter<
  Data extends Record<PropertyKey, unknown>,
  DataIndex extends Extract<keyof Data, string>
> = {
  children?: Array<TableColumnFilter<Data, DataIndex>>;
  text: React.ReactNode;
  value: boolean | number | string;
};

type TableColumnFilterConfig<
  Data extends Record<PropertyKey, unknown>,
  DataIndex extends Extract<keyof Data, string>
> = {
  filters: Array<TableColumnFilter<Data, DataIndex>>;
  onFilter: <T extends boolean | number | string>(
    value: T,
    data: Data
  ) => boolean;
};

type TableColumnConfig<
  Data extends Record<PropertyKey, unknown>,
  DataIndex extends Extract<keyof Data, string>
> = {
  align?: "center" | "left" | "right";
  className?: string;
  dataIndex?: DataIndex;
  onSort?: (a: Data, b: Data) => number;
  render: TableColumnPropsFn<Data>;
  responsive?: AntdTableColumn<Data>["responsive"];
  title: React.ReactNode;
} & (
  | TableColumnFilterConfig<Data, DataIndex>
  | { filters?: never; onFilter?: never }
);

export type TableProps<
  Data extends Record<PropertyKey, unknown>,
  DataIndex extends Extract<keyof Data, string>
> = {
  bordered?: boolean;
  columns: Array<Falsy | TableColumnConfig<Data, DataIndex>>;
  dataSource: Data[];
  onActionsRender?: TableColumnPropsFn<
    Data,
    number,
    MaybeArray<Falsy | TableActionProps<Data>>
  >;
  onRowClick?: TableColumnPropsFn<Data, number | undefined, void>;
  size?: AntdTableProps<Data>["size"];
};

export function Table<
  T extends Record<PropertyKey, unknown>,
  U extends Extract<keyof T, string>
>({
  columns: columnsProp,
  dataSource,
  onActionsRender,
  bordered = true,
  size = "small",
  onRowClick,
}: TableProps<T, U>): JSX.Element {
  const actionsColumnKey = useId();

  const columns = useMemo(
    (): Array<TableColumnConfig<T, U>> =>
      [
        ...columnsProp,
        onActionsRender
          ? { title: "Ações", key: actionsColumnKey, render: onActionsRender }
          : undefined,
      ].filter(handleFilterFalsies),
    [columnsProp, actionsColumnKey, onActionsRender]
  );

  const handleRow = useCallback(
    (data: T, dataIndex?: number) => {
      return {
        ...(onRowClick
          ? {
              onClick: (): void => {
                onRowClick(data, dataIndex);
              },
              className: classes.ClickableRow,
            }
          : {}),
      };
    },
    [onRowClick]
  );

  const handleActionsRender = useCallback(
    (
      data: T,
      dataIndex: number,
      actions: MaybeArray<Falsy | TableActionProps<T>>
    ): React.ReactNode => {
      const actionsArr = isArray(actions) ? [...actions] : [actions];

      return (
        <Space>
          {actionsArr
            .filter(handleFilterFalsies)
            .map(({ title, label, icon, disabled, onClick }) => (
              <TableAction
                data={data}
                dataIndex={dataIndex}
                disabled={disabled ?? false}
                icon={icon || null}
                key={nanoid()}
                label={label || null}
                onClick={onClick}
                title={title || null}
              />
            ))}
        </Space>
      );
    },
    []
  );

  return (
    <AntdTable<T>
      bordered={bordered}
      columns={columns.map((column) => ({
        key: nanoid(),

        ...column,

        render: (_, data, idx): React.ReactNode =>
          isActionsColumn(column, actionsColumnKey) && onActionsRender
            ? handleActionsRender(data, idx, onActionsRender(data, idx))
            : column.render(data, idx),

        sorter: column.onSort && ((a, b): number => column.onSort?.(a, b) || 0),

        ...(isActionsColumn(column, actionsColumnKey)
          ? { align: "center" }
          : {}),
      }))}
      dataSource={dataSource}
      locale={TABLE_LOCALE}
      onRow={handleRow}
      size={size}
    />
  );
}

function isActionsColumn(
  column: Record<PropertyKey, unknown> | { key: string },
  actionsColumnKey: string
): boolean {
  return "key" in column && column.key === actionsColumnKey;
}
