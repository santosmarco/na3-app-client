import { AdminCreateUserForm, CreateFormPage } from "@components";
import React from "react";

export function AdminUsersCreatePage(): JSX.Element {
  return (
    <CreateFormPage
      backUrl="/admin/usuarios"
      description="Defina o usuário."
      title="Criar usuário"
    >
      <AdminCreateUserForm />
    </CreateFormPage>
  );
}
