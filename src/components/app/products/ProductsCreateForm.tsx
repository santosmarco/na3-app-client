import { DeleteOutlined } from "@ant-design/icons";
import { Collapse, Divider, Form, FormField, SubmitButton } from "@components";
import { useValidatedForm } from "@hooks";
import { useNa3NativeProducts } from "@modules/na3-react/hooks";
import type { Product, ProductDepartmentId } from "@schemas";
import {
  EProductDepartmentId,
  ProductPackageTypeSchema,
  ProductSchema,
  ProductUnitSchema,
} from "@schemas";
import { createErrorNotifier } from "@utils";
import { Button, Col, Modal, notification, Row, Space, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { ProductsCreateKitAutomaticoForm } from "./byDepartment/KitAutomatico";

type ProductsCreateFormProps = {
  editingProduct?: Product & { id: string };
  onClone?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
};

const defaultProps = {
  onSubmit: undefined,
};

export function ProductsCreateForm({
  editingProduct,
  onSubmit,
  onDelete,
  onClone,
}: ProductsCreateFormProps): JSX.Element {
  const {
    helpers: { createProduct, editProduct, deleteProduct },
  } = useNa3NativeProducts();

  const [selectedDpt, setSelectedDpt] = useState<ProductDepartmentId>();
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [isCloningProduct, setIsCloningProduct] = useState(false);

  const form = useValidatedForm(ProductSchema, {
    defaultValues: editingProduct,
  });

  const handleDepartmentIdChange = useCallback((value: ProductDepartmentId) => {
    setSelectedDpt(value);
  }, []);

  const handleCloneProduct = useCallback(() => {
    setIsEditingEnabled(true);
    setIsCloningProduct(true);

    form.setValue("name", "");
    form.setValue("code", "");
    form.setValue("description", "");

    onClone?.();
  }, [form, onClone]);

  const handleSubmit = useCallback(
    (product: Product) => {
      const notifyError = createErrorNotifier(
        `Erro ao ${editingProduct ? "editar" : "criar"} o produto`
      );

      Modal.confirm({
        content: `Confirma a ${
          isCloningProduct || !editingProduct ? "criação" : "edição"
        } do produto "${product.name}"?`,
        okText: "Confirmar",
        onOk: async () => {
          const operationRes = await (editingProduct && !isCloningProduct
            ? editProduct(editingProduct.id, product)
            : createProduct(product));

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: `O produto "${product.name}" foi ${
                editingProduct ? "editado" : "criado"
              } com sucesso!`,
              message: `Produto ${editingProduct ? "editado" : "criado"}`,
            });

            onSubmit?.();
          }
        },
      });
    },
    [isCloningProduct, editingProduct, onSubmit, createProduct, editProduct]
  );

  const handleDelete = useCallback(() => {
    if (!editingProduct) {
      return;
    }

    Modal.confirm({
      content: `Confirma a exclusão do produto "${editingProduct.name}"?`,
      okText: "Confirmar",
      onOk: async () => {
        const notifyError = createErrorNotifier(`Erro ao deletar o produto`);

        const operationRes = await deleteProduct(editingProduct.id);

        if (operationRes.error) {
          notifyError(operationRes.error.message);
        } else {
          notification.success({
            description: `O produto "${editingProduct.name}" foi deletado com sucesso!`,
            message: `Produto deletado`,
          });
        }

        onDelete?.();
      },
    });
  }, [editingProduct, deleteProduct, onDelete]);

  console.log(form);

  useEffect(() => {
    if (editingProduct) {
      setSelectedDpt(editingProduct.variant.kind);
    }
  }, [editingProduct]);

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      requiredPrivileges={["products_write_all"]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography.Title level={5}>Setor</Typography.Title>

        {!!editingProduct && !isCloningProduct && (
          <Space>
            {!isEditingEnabled && (
              <Button
                onClick={(): void => {
                  setIsEditingEnabled((currVal) => !currVal);
                }}
                type="primary"
              >
                Habilitar edição
              </Button>
            )}
            <Button
              onClick={handleCloneProduct}
              type={isEditingEnabled ? "primary" : "ghost"}
            >
              Clonar produto
            </Button>
          </Space>
        )}
      </div>

      <FormField
        disabled={!!editingProduct}
        forceValidation={!!editingProduct}
        helpWhenDisabled={
          !!editingProduct &&
          "Para alterar o setor do produto, é necessário deletá-lo e criá-lo novamente."
        }
        label="Setor"
        name={form.fieldNames("variant.kind")}
        onValueChange={handleDepartmentIdChange}
        options={ProductSchema.shape.variant.options.map((opt) => ({
          value: opt.shape.kind.value,
          label: opt.shape.kind.value,
        }))}
        rules={null}
        type="select"
      />

      {selectedDpt && (
        <>
          <Divider />

          <Typography.Title level={5}>Informações básicas</Typography.Title>
          <Row gutter={16}>
            <Col md={6} sm={8} xs={24}>
              <FormField
                autoUpperCase={true}
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Código"
                mask={new Array(10).fill(/\d/)}
                name={form.fieldNames("code")}
                rules={null}
                type="mask"
              />
            </Col>
            <Col md={18} sm={16} xs={24}>
              <FormField
                autoUpperCase={true}
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Nome"
                name={form.fieldNames("name")}
                rules={null}
                type="input"
              />
            </Col>
          </Row>
          <FormField
            disabled={!!editingProduct && !isEditingEnabled}
            forceValidation={!!editingProduct}
            label="Descrição/Informações adicionais"
            name={form.fieldNames("description")}
            required={false}
            rules={null}
            type="textArea"
          />

          <Divider />
          <Row gutter={16}>
            <Col md={8} sm={24} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Tipo de embalagem"
                name={form.fieldNames("packageType")}
                options={ProductPackageTypeSchema.options.map((opt) => ({
                  value: opt,
                  label: opt,
                }))}
                rules={null}
                type="select"
              />
            </Col>
            <Col md={8} sm={24} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Qtd. por embalagem"
                name={form.fieldNames("qtyPerPackage")}
                rules={null}
                type="number"
              />
            </Col>
            <Col md={8} sm={24} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Unidade"
                name={form.fieldNames("unit")}
                options={ProductUnitSchema.options.map((opt) => ({
                  value: opt,
                  label: opt,
                }))}
                rules={null}
                type="select"
              />
            </Col>
          </Row>

          {selectedDpt === EProductDepartmentId.KitAutomatico ? (
            <ProductsCreateKitAutomaticoForm
              editingProduct={editingProduct}
              fieldNames={form.fieldNames}
              isEditingEnabled={isEditingEnabled}
            />
          ) : null}
        </>
      )}

      {editingProduct && isEditingEnabled && (
        <>
          <Divider />
          <Collapse
            panels={[
              {
                header: "Avançado",
                content: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography.Text>Excluir produto?</Typography.Text>
                    <Button
                      danger={true}
                      icon={<DeleteOutlined />}
                      onClick={handleDelete}
                      type="primary"
                    >
                      Excluir produto permanentemente
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </>
      )}

      <Divider />

      <SubmitButton
        label={`${
          isCloningProduct || !editingProduct ? "Criar" : "Salvar"
        } produto`}
        labelWhenLoading={`${
          isCloningProduct || !editingProduct ? "Criando" : "Salvando"
        } produto...`}
      />
    </Form>
  );
}

ProductsCreateForm.defaultProps = defaultProps;
