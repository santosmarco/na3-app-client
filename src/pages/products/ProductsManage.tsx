import {
  ListFormPage,
  ModalWide,
  ProductsCreateForm,
  ProductsList,
} from "@components";
import { useNa3NativeProducts } from "@modules/na3-react/hooks";
import type { Product } from "@schemas";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export function ProductsManagePage(): JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<
    Product & { id: string }
  >();
  const [isCloningProduct, setIsCloningProduct] = useState(false);

  const history = useHistory();

  const na3NativeProducts = useNa3NativeProducts();

  const handleCreateProductClick = useCallback(() => {
    history.push("/produtos/criar");
  }, [history]);

  const handleSelectProduct = useCallback(
    (product: Product & { id: string }) => {
      setSelectedProduct(product);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(undefined);
    setIsCloningProduct(false);
  }, []);

  return (
    <>
      <ListFormPage
        actions={[
          {
            label: "Criar produto",
            onClick: handleCreateProductClick,
            alwaysVisible: true,
          },
        ]}
        formTitle="Novo produto"
        list={
          <ProductsList
            data={na3NativeProducts.data || []}
            onSelectProduct={handleSelectProduct}
          />
        }
        listTitle="Todos os produtos"
        title="Produtos"
      />

      <ModalWide
        onClose={handleCloseModal}
        title={
          isCloningProduct
            ? `Clonando produto: "${String(selectedProduct?.name)}"`
            : selectedProduct?.name
        }
        visible={!!selectedProduct}
      >
        <ProductsCreateForm
          editingProduct={selectedProduct}
          onClone={(): void => {
            setIsCloningProduct(true);
          }}
          onDelete={handleCloseModal}
          onSubmit={handleCloseModal}
        />
      </ModalWide>
    </>
  );
}
