import React from "react";

import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import { Page } from "../Page";

type TablePageProps = {
  children: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  title: string;
};

export function TablePage({
  title,
  description,
  icon,
  children,
}: TablePageProps): JSX.Element {
  return (
    <>
      <PageTitle
        icon={icon}
        marginBottom={!description ? "paragraph" : undefined}
      >
        {title}
      </PageTitle>
      {description && <PageDescription>{description}</PageDescription>}

      <Page>{children}</Page>
    </>
  );
}
