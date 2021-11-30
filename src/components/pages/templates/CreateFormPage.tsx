import { Divider, Page, PageDescription, PageTitle } from "@components";
import type { AppRoutePath } from "@config";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

type CreateFormPageProps = {
  backUrl: AppRoutePath;
  children: React.ReactElement<{ onSubmit: () => void }>;
  description?: string;
  title: string;
};

export function CreateFormPage({
  backUrl,
  title,
  children,
  description,
}: CreateFormPageProps): JSX.Element {
  const history = useHistory();

  const handleNavigateBack = useCallback(() => {
    history.replace(backUrl as string);
  }, [history, backUrl]);

  return (
    <>
      <PageTitle>{title}</PageTitle>
      {description && <PageDescription>{description}</PageDescription>}

      <Divider marginTop={0} />

      <Page scrollTopOffset={24}>
        {React.cloneElement(children, { onSubmit: handleNavigateBack })}
      </Page>
    </>
  );
}
