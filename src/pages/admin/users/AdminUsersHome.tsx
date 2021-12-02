import { AdminCreateUserForm, AdminUsersList, ListFormPage } from "@components";
import { useQuery } from "@hooks";
import type { AppUser } from "@modules/na3-react";
import { useNa3Users } from "@modules/na3-react";
import { UserProfilePage } from "@pages";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function AdminUsersHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("matricula");

  const users = useNa3Users();

  const handleUserCreateClick = useCallback(() => {
    history.push("/admin/usuarios/criar");
  }, [history]);

  const handleUserSelect = useCallback(
    ({ registrationId }: AppUser) => {
      history.push(`/admin/usuarios?matricula=${registrationId}`);
    },
    [history]
  );

  const handleUserCreateSuccess = useCallback(() => {
    history.replace("/admin/usuarios");
  }, [history]);

  return query.matricula ? (
    <UserProfilePage fromAdmin={true} registrationId={query.matricula} />
  ) : (
    <ListFormPage
      actions={[{ label: "Novo usuário", onClick: handleUserCreateClick }]}
      form={<AdminCreateUserForm onSubmit={handleUserCreateSuccess} />}
      formTitle="Novo usuário"
      list={
        <AdminUsersList
          data={users.data}
          error={users.error?.message}
          loading={users.loading}
          onSelectUser={handleUserSelect}
        />
      }
      listTitle="Usuários"
      title="Admin • Gerenciar Usuários"
    />
  );
}
