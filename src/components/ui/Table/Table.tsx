import { TABLE_LOCALE } from "@constants";
import { useId } from "@hooks";
import type { MaybeArray } from "@types";
import { handleFilterFalsies, isArray } from "@utils";
import type { TableColumnsType, TableProps as AntdTableProps } from "antd";
import { Space, Table as AntdTable, Tooltip } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useMemo } from "react";
import type { Falsy } from "utility-types";

import classes from "./Table.module.css";
import type { TableActionProps } from "./TableAction/TableAction";
import { TableAction } from "./TableAction/TableAction";

type AntdColumn<T> = TableColumnsType<T>[number];

export type TableData = Record<PropertyKey, unknown>;

type TableDataIndex<Data extends TableData> = Extract<keyof Data, string>;

export type TableGetDataFn<
  Data extends TableData,
  Index extends number | undefined,
  Return
> = (data: Data, index: Index) => Return;

type TableFilter<
  Data extends TableData,
  DataIndex extends TableDataIndex<Data>
> = {
  children?: Array<TableFilter<Data, DataIndex>>;
  text: React.ReactNode;
  value: boolean | number | string;
};

type TableColumn<
  Data extends TableData,
  DataIndex extends TableDataIndex<Data>
> = {
  align?: "center" | "left" | "right";
  className?: string;
  dataIndex?: DataIndex;
  hidden?: boolean;
  onRender: TableGetDataFn<Data, number, React.ReactNode>;
  onSort?: (a: Data, b: Data) => number;
  responsive?: AntdColumn<Data>["responsive"];
  title: React.ReactNode;
} & (
  | {
      filters: Array<TableFilter<Data, DataIndex>>;
      onFilter: <T extends boolean | number | string>(
        value: T,
        data: Data
      ) => boolean;
    }
  | { filters?: never; onFilter?: never }
);

export type TableActions<Data extends TableData> = {
  disabled?: boolean;
  items: MaybeArray<TableActionProps<Data>>;
  tooltip?: React.ReactNode;
};

export type TableProps<
  Data extends TableData,
  DataIndex extends TableDataIndex<Data>
> = {
  actions?: TableGetDataFn<Data, number, TableActions<Data>>;
  bordered?: boolean;
  columns: Array<Falsy | TableColumn<Data, DataIndex>>;
  dataSource: Data[];
  onRowClick?: TableGetDataFn<Data, number | undefined, void>;
  size?: AntdTableProps<Data>["size"];
};

export function Table<T extends TableData, U extends TableDataIndex<T>>({
  columns: columnsProp,
  dataSource,
  actions,
  bordered = true,
  size = "small",
  onRowClick,
}: TableProps<T, U>): JSX.Element {
  const actionsColumnKey = useId();

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
    (data: T, index: number): React.ReactNode => {
      if (!actions) {
        return;
      }

      const {
        items,
        tooltip,
        disabled: allActionsDisabled,
      } = actions(data, index);

      const itemsArr = isArray(items) ? [...items] : [items];

      return (
        <Tooltip
          placement="topRight"
          title={tooltip}
          visible={tooltip ? undefined : false}
        >
          <Space>
            {itemsArr
              .filter(handleFilterFalsies)
              .map(({ title, label, icon, disabled, onClick }) => (
                <TableAction
                  data={data}
                  dataIndex={index}
                  disabled={allActionsDisabled || (disabled ?? false)}
                  icon={icon || null}
                  key={nanoid()}
                  label={label || null}
                  onClick={onClick}
                  title={(!tooltip && title) || null}
                />
              ))}
          </Space>
        </Tooltip>
      );
    },
    [actions]
  );

  const columns = useMemo(() => {
    type Column = TableColumn<T, U> & { key: string };

    const columns: Column[] = [...columnsProp]
      .filter(handleFilterFalsies)
      .filter((col) => !col.hidden)
      .map((col) => ({ ...col, key: nanoid() }));

    if (actions) {
      const actionsColumn: Column = {
        title: "Ações",
        key: actionsColumnKey,
        align: "center",
        onRender: handleActionsRender,
      };
      columns.push(actionsColumn);
    }

    return columns;
  }, [columnsProp, actions, actionsColumnKey, handleActionsRender]);

  return (
    <AntdTable<T>
      bordered={bordered}
      columns={columns.map(
        (column): AntdColumn<T> => ({
          ...column,
          render: (_, data, idx): React.ReactNode => column.onRender(data, idx),
          sorter: column.onSort,
        })
      )}
      dataSource={dataSource}
      locale={TABLE_LOCALE}
      onRow={handleRow}
      size={size}
    />
  );
}
