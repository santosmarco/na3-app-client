import {
  AdminCreateUserForm,
  Divider,
  Page,
  PageDescription,
  PageTitle,
} from "@components";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function AdminUsersCreatePage(): JSX.Element {
  const history = useHistory();

  const handleNavigateBack = useCallback(() => {
    history.replace("/admin/usuarios");
  }, [history]);

  return (
    <>
      <PageTitle>Criar usuário</PageTitle>
      <PageDescription>Defina o usuário.</PageDescription>

      <Divider marginTop={0} />

      <Page scrollTopOffset={24}>
        <AdminCreateUserForm onSubmit={handleNavigateBack} />
      </Page>
    </>
  );
}
