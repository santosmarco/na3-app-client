import { Divider, FormField } from "@components";
import type { FieldNamesFn } from "@hooks";
import type { Product, ProductSchema } from "@schemas";
import { EMeasurementUnit } from "@schemas";
import { Col, Row, Typography } from "antd";
import React from "react";

import { MinNomMaxGroup } from "../fields/MinNomMaxGroup";

export type ProductsCreateKitAutomaticoFormProps = {
  editingProduct: Product | undefined;
  fieldNames: FieldNamesFn<typeof ProductSchema>;
  isEditingEnabled: boolean;
};

export function ProductsCreateKitAutomaticoForm({
  fieldNames,
  editingProduct,
  isEditingEnabled,
}: ProductsCreateKitAutomaticoFormProps): JSX.Element {
  console.log(editingProduct);
  return (
    <>
      <Divider>Folheto</Divider>
      <Row align="bottom" gutter={16}>
        <Col md={6} xs={24}>
          <FormField
            disabled={!!editingProduct && !isEditingEnabled}
            forceValidation={!!editingProduct}
            label="Gramatura"
            name={fieldNames("variant.subProducts.leaflet.grammage")}
            noDecimal={true}
            rules={null}
            suffix="g/m²"
            type="number"
          />
        </Col>
        <Col md={18} xs={24}>
          <Typography.Paragraph strong={true}>Cores</Typography.Paragraph>
          <Row gutter={8}>
            <Col md={6} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Cor 1"
                name={fieldNames("variant.subProducts.leaflet.colors.0")}
                rules={null}
                type="input"
              />
            </Col>
            <Col md={6} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Cor 2"
                name={fieldNames("variant.subProducts.leaflet.colors.1")}
                rules={null}
                type="input"
              />
            </Col>
            <Col md={6} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Cor 3"
                name={fieldNames("variant.subProducts.leaflet.colors.2")}
                rules={null}
                type="input"
              />
            </Col>
            <Col md={6} xs={24}>
              <FormField
                disabled={!!editingProduct && !isEditingEnabled}
                forceValidation={!!editingProduct}
                label="Cor 4"
                name={fieldNames("variant.subProducts.leaflet.colors.3")}
                rules={null}
                type="input"
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <MinNomMaxGroup
        editingProduct={editingProduct}
        fields={[
          {
            title: "Largura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.leaflet.opened.width.min"),
              nom: fieldNames("variant.subProducts.leaflet.opened.width.nom"),
              max: fieldNames("variant.subProducts.leaflet.opened.width.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
          {
            title: "Altura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.leaflet.opened.height.min"),
              nom: fieldNames("variant.subProducts.leaflet.opened.height.nom"),
              max: fieldNames("variant.subProducts.leaflet.opened.height.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
        ]}
        isEditingEnabled={isEditingEnabled}
        title="Folheto (aberto)"
      />

      <MinNomMaxGroup
        editingProduct={editingProduct}
        fields={[
          {
            title: "Largura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.leaflet.closed.width.min"),
              nom: fieldNames("variant.subProducts.leaflet.closed.width.nom"),
              max: fieldNames("variant.subProducts.leaflet.closed.width.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
          {
            title: "Altura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.leaflet.closed.height.min"),
              nom: fieldNames("variant.subProducts.leaflet.closed.height.nom"),
              max: fieldNames("variant.subProducts.leaflet.closed.height.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
        ]}
        isEditingEnabled={isEditingEnabled}
        title="Folheto (fechado)"
      />

      <MinNomMaxGroup
        editingProduct={editingProduct}
        fields={[
          {
            title: "Largura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.glove.internal.width.min"),
              nom: fieldNames("variant.subProducts.glove.internal.width.nom"),
              max: fieldNames("variant.subProducts.glove.internal.width.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
          {
            title: "Altura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.glove.internal.height.min"),
              nom: fieldNames("variant.subProducts.glove.internal.height.nom"),
              max: fieldNames("variant.subProducts.glove.internal.height.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
          {
            title: "Espessura",
            titleRight: "micra",
            names: {
              min: fieldNames(
                "variant.subProducts.glove.internal.thickness.min"
              ),
              nom: fieldNames(
                "variant.subProducts.glove.internal.thickness.nom"
              ),
              max: fieldNames(
                "variant.subProducts.glove.internal.thickness.max"
              ),
            },
            unit: EMeasurementUnit.Micrometer,
          },
        ]}
        isEditingEnabled={isEditingEnabled}
        title="Luva (interna)"
      />

      <MinNomMaxGroup
        editingProduct={editingProduct}
        fields={[
          {
            title: "Largura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.glove.external.width.min"),
              nom: fieldNames("variant.subProducts.glove.external.width.nom"),
              max: fieldNames("variant.subProducts.glove.external.width.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
          {
            title: "Altura",
            titleRight: EMeasurementUnit.Millimeter,
            names: {
              min: fieldNames("variant.subProducts.glove.external.height.min"),
              nom: fieldNames("variant.subProducts.glove.external.height.nom"),
              max: fieldNames("variant.subProducts.glove.external.height.max"),
            },
            unit: EMeasurementUnit.Millimeter,
          },
          {
            title: "Espessura",
            titleRight: "micra",
            names: {
              min: fieldNames(
                "variant.subProducts.glove.external.thickness.min"
              ),
              nom: fieldNames(
                "variant.subProducts.glove.external.thickness.nom"
              ),
              max: fieldNames(
                "variant.subProducts.glove.external.thickness.max"
              ),
            },
            unit: EMeasurementUnit.Micrometer,
          },
        ]}
        isEditingEnabled={isEditingEnabled}
        title="Luva (externa)"
      />
    </>
  );
}
