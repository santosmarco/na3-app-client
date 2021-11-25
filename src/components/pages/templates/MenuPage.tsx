import React from "react";

import type { StaticListItemProps } from "../../lists/components/StaticListItem";
import { StaticList } from "../../lists/StaticList";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";

type MenuPageProps = {
  description?: string;
  icon?: React.ReactNode;
  items: StaticListItemProps[];
  title: string;
};

const defaultProps: Omit<MenuPageProps, "items" | "title"> = {
  description: undefined,
  icon: null,
};

export function MenuPage({
  items,
  title,
  description,
  icon,
}: MenuPageProps): JSX.Element {
  return (
    <>
      <PageTitle icon={icon}>{title}</PageTitle>
      {description && <PageDescription>{description}</PageDescription>}

      <StaticList data={items} renderItem={null} />
    </>
  );
}

MenuPage.defaultProps = defaultProps;
