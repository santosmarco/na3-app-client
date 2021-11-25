import React, { useCallback } from "react";

import type { StaticListItemProps } from "./components/StaticListItem";
import { StaticListItem } from "./components/StaticListItem";
import type { ListProps, ListRenderItem } from "./List";
import { List } from "./List";

type StaticListProps<Item> =
  | (Omit<
      ListProps<StaticListItemProps>,
      "data" | "error" | "isLoading" | "renderItem"
    > & { data: StaticListItemProps[]; renderItem: null })
  | (Omit<ListProps<Item>, "data" | "error" | "isLoading" | "renderItem"> & {
      data: Item[];
      renderItem: ListRenderItem<Item>;
    });

export function StaticList<Item extends Record<string, unknown>>({
  verticalSpacing,
  ...props
}: StaticListProps<Item>): JSX.Element {
  const handleRenderDefaultItem = useCallback(
    ({
      title,
      description,
      colors,
      icon,
      href,
      onClick,
    }: StaticListItemProps) => (
      <StaticListItem
        colors={colors}
        description={description}
        href={href}
        icon={icon}
        onClick={onClick}
        title={title}
      />
    ),
    []
  );

  return props.renderItem ? (
    <List<Item>
      data={props.data}
      error={null}
      isLoading={false}
      isStatic={true}
      renderItem={props.renderItem}
      verticalSpacing={verticalSpacing || 8}
    />
  ) : (
    <List<StaticListItemProps>
      data={props.data}
      error={null}
      isLoading={false}
      isStatic={true}
      renderItem={handleRenderDefaultItem}
      verticalSpacing={verticalSpacing || 8}
    />
  );
}
