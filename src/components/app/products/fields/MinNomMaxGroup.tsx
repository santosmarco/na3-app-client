import { Divider } from "@components";
import type { MeasurementUnit, Product } from "@schemas";
import { Col, Row, Space, Typography } from "antd";
import React from "react";

import { MinNomMaxFields } from "./MinNomMaxFields";

type MinNomMaxGroupProps = {
  editingProduct: Product | undefined;
  fields: Array<{
    names: {
      max: string;
      min: string;
      nom: string;
    };
    noDecimal?: boolean;
    title: string;
    titleRight?: string;
    unit?: MeasurementUnit;
  }>;
  isEditingEnabled: boolean;
  title: string;
};

export function MinNomMaxGroup({
  title,
  fields,
  editingProduct,
  isEditingEnabled,
}: MinNomMaxGroupProps): JSX.Element {
  return (
    <>
      <Divider>{title}</Divider>
      <Row gutter={16}>
        {fields.map((field) => (
          <Col
            key={JSON.stringify(field.names)}
            md={24 / fields.length}
            xs={24}
          >
            <Space align="baseline">
              <Typography.Paragraph strong={true}>
                {field.title}
              </Typography.Paragraph>
              {field.titleRight && (
                <Typography.Text italic={true}>
                  ({field.titleRight})
                </Typography.Text>
              )}
            </Space>
            <MinNomMaxFields
              editingProduct={editingProduct}
              isEditingEnabled={isEditingEnabled}
              names={field.names}
              noDecimal={field.noDecimal}
              unit={field.unit}
            />
          </Col>
        ))}
      </Row>
    </>
  );
}
