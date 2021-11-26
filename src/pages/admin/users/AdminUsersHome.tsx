import { AdminCreateUserForm, AdminUsersList, ListFormPage } from "@components";
import { useQuery } from "@hooks";
import { useNa3Users } from "@modules/na3-react";
import type { Na3User } from "@modules/na3-types";
import { AdminUserDetailsPage } from "@pages";
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
    ({ registrationId }: Na3User) => {
      history.push(`/admin/usuarios?matricula=${registrationId}`);
    },
    [history]
  );

  return query.matricula ? (
    <AdminUserDetailsPage
      user={users.helpers.getByRegistrationId(query.matricula)}
    />
  ) : (
    <ListFormPage
      actions={[{ label: "Novo usuário", onClick: handleUserCreateClick }]}
      form={<AdminCreateUserForm />}
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
