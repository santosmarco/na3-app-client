import { FormField } from "@components";
import type { MeasurementUnit, Product } from "@schemas";
import { Col, Row } from "antd";
import React from "react";

type MinNomMaxFieldsProps = {
  editingProduct: Product | undefined;
  isEditingEnabled: boolean;
  names: {
    max: string;
    min: string;
    nom: string;
  };
  noDecimal?: boolean;
  unit?: MeasurementUnit;
};

export function MinNomMaxFields({
  names,
  unit,
  noDecimal = true,
  editingProduct,
  isEditingEnabled,
}: MinNomMaxFieldsProps): JSX.Element {
  return (
    <Row gutter={8}>
      <Col md={8} sm={24} xs={24}>
        <FormField
          disabled={!!editingProduct && !isEditingEnabled}
          forceValidation={!!editingProduct}
          label="Mínima"
          name={names.min}
          noDecimal={noDecimal}
          rules={null}
          suffix={unit}
          type="number"
        />
      </Col>
      <Col md={8} sm={24} xs={24}>
        <FormField
          disabled={!!editingProduct && !isEditingEnabled}
          forceValidation={!!editingProduct}
          label="Nominal"
          name={names.nom}
          noDecimal={noDecimal}
          rules={null}
          suffix={unit}
          type="number"
        />
      </Col>
      <Col md={8} sm={24} xs={24}>
        <FormField
          disabled={!!editingProduct && !isEditingEnabled}
          forceValidation={!!editingProduct}
          label="Máxima"
          name={names.max}
          noDecimal={noDecimal}
          rules={null}
          suffix={unit}
          type="number"
        />
      </Col>
    </Row>
  );
}
