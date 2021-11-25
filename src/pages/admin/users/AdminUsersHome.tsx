import { AdminCreateUserForm, ListFormPage } from "@components";
import { useQuery } from "@hooks";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function AdminUsersHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("matricula");

  const handleUserCreateClick = useCallback(() => {
    history.push("/admin/usuarios/criar");
  }, [history]);

  return query.matricula ? (
    <>DETAILS</>
  ) : (
    <ListFormPage
      actions={[{ label: "Novo usuário", onClick: handleUserCreateClick }]}
      form={<AdminCreateUserForm />}
      formTitle="Novo usuário"
      list={"LIST"}
      listTitle="Usuários"
      title="Admin • Gerenciar Usuários"
    />
  );
}
