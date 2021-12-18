import { FormItem, Na3PositionSelect } from "@components";
import type { Na3PositionId } from "@modules/na3-types";
import { Col, Row } from "antd";
import React from "react";

type DocsStdPermissionsSelectProps = {
  name: string;
  verb: string;
  onValueChange: (positionIds: Na3PositionId[]) => void;
  required?: boolean;
  selectablePositions?: Na3PositionId[];
  defaultValue?: Na3PositionId[];
  disabled?: boolean;
  errorMessage?: string;
};

export function DocsStdPermissionsSelect({
  name,
  verb,
  onValueChange,
  required,
  selectablePositions,
  defaultValue,
  disabled,
  errorMessage,
}: DocsStdPermissionsSelectProps): JSX.Element {
  return (
    <Row gutter={16}>
      <Col md={8} xs={24}>
        <FormItem
          description={
            <>
              Selecione as posições que poderão{" "}
              <strong>{verb.trim().toLowerCase()}</strong> o documento.
            </>
          }
          label={`Permissões de ${name.trim().toLowerCase()}`}
          required={required}
        />
      </Col>
      <Col md={16} xs={24}>
        <Na3PositionSelect
          defaultValue={defaultValue}
          disabled={disabled}
          errorMessage={errorMessage}
          onValueChange={onValueChange}
          required={required}
          selectablePositions={selectablePositions}
        />
      </Col>
    </Row>
  );
}
