import { CreateFormPage, ProductsCreateForm } from "@components";
import React from "react";

export function ProductsCreatePage(): JSX.Element {
  return (
    <CreateFormPage
      backUrl="/produtos/lista"
      description="Defina o produto."
      title="Criar Produto"
    >
      <ProductsCreateForm />
    </CreateFormPage>
  );
}
