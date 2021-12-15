import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FormField } from "@components";
import { useNa3Departments, useNa3Users } from "@modules/na3-react";
import type { Na3DepartmentId, Na3PositionId } from "@modules/na3-types";
import {
  getDepartmentSelectOptions,
  removeDuplicates,
  removeNullables,
} from "@utils";
import { Button, Col, Row } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import classes from "./Na3PositionSelect.module.css";

type PositionField = {
  departmentId: Na3DepartmentId | "";
  id: string;
  name: `position-${string}`;
  positionId: Na3PositionId | "";
};

type Na3PositionSelectProps = {
  errorMessage?: string;
  helpWhenEmpty?: React.ReactNode;
  onValueChange?: (positionIds: Na3PositionId[]) => void;
  selectablePositions?: Na3PositionId[];
  required?: boolean;
  disabled?: boolean;
};

const defaultProps = {
  required: true,
};

export function Na3PositionSelect({
  onValueChange,
  errorMessage,
  selectablePositions,
  helpWhenEmpty,
  required,
  disabled,
}: Na3PositionSelectProps): JSX.Element {
  const departments = useNa3Departments();
  const users = useNa3Users();

  const [positionFields, setPositionFields] = useState<PositionField[]>([
    createBlankPositionField(),
  ]);

  const selectableDepartmentOptions = useMemo(() => {
    if (!departments.data) {
      return [];
    }

    let dpts = departments.data;

    if (selectablePositions) {
      dpts = removeNullables(
        removeDuplicates(
          selectablePositions.map(
            (pos) => departments.helpers.splitPositionId(pos)[0]
          )
        ).map((dptId) => departments.helpers.getById(dptId))
      );
    }

    return getDepartmentSelectOptions(
      dpts.filter((dpt) => {
        const allDptPositionsAreSelected = dpt.positions.every((pos) =>
          positionFields.map((posField) => posField.positionId).includes(pos.id)
        );

        return !allDptPositionsAreSelected;
      })
    );
  }, [
    departments.data,
    departments.helpers,
    positionFields,
    selectablePositions,
  ]);

  const getSelectablePositionOptions = useCallback(
    (departmentId: Na3DepartmentId) => {
      const dpt = departments.helpers.getById(departmentId);

      if (!dpt) {
        return [];
      }

      return dpt.positions
        .filter((pos) => {
          const posIsSelectable = selectablePositions
            ? selectablePositions.includes(pos.id)
            : true;
          const posIsAlreadySelected = positionFields
            .map((posField) => posField.positionId)
            .includes(pos.id);

          return posIsSelectable && !posIsAlreadySelected;
        })
        .map((pos) => {
          const numOfUsersInPosition =
            users.helpers.getAllInPositions(pos).length;

          return {
            label: (
              <>
                {pos.shortName.trim().toUpperCase()}{" "}
                <small>
                  <em>
                    (
                    {numOfUsersInPosition === 0
                      ? "Nenhum usuário"
                      : numOfUsersInPosition === 1
                      ? "Um usuário"
                      : `${numOfUsersInPosition} usuários`}
                    )
                  </em>
                </small>
              </>
            ),
            labelWhenSelected: pos.shortName.trim().toUpperCase(),
            value: pos.id,
          };
        });
    },
    [departments.helpers, users.helpers, positionFields, selectablePositions]
  );

  const handlePositionFieldAdd = useCallback(() => {
    setPositionFields((curr) => [...curr, createBlankPositionField()]);
  }, []);

  const handlePositionFieldRemove = useCallback((fieldId: string) => {
    setPositionFields((curr) => {
      const fieldIdx = curr.findIndex((field) => field.id === fieldId);
      return [...curr.slice(0, fieldIdx), ...curr.slice(fieldIdx + 1)];
    });
  }, []);

  const handlePositionFieldChange = useCallback(
    <T extends "departmentId" | "positionId">(
      fieldId: string,
      valueKey: T,
      value: Exclude<PositionField[T], "">
    ) => {
      const fieldIdx = positionFields.findIndex(
        (field) => field.id === fieldId
      );

      if (positionFields[fieldIdx][valueKey] !== value) {
        setPositionFields((curr) => {
          const updated = [...curr];
          updated[fieldIdx] = {
            ...updated[fieldIdx],
            positionId: "",
            [valueKey]: value,
          };
          return updated;
        });
      }
    },
    [positionFields]
  );

  useEffect(() => {
    onValueChange?.(
      positionFields
        .map((posField) => posField.positionId)
        .filter((posId): posId is Na3PositionId => posId !== "")
    );
  }, [positionFields, onValueChange]);

  return (
    <>
      {positionFields.map((field, idx) => (
        <Row gutter={{ xs: 6, sm: 6, md: 6, lg: 16 }} key={field.id}>
          <Col span={12}>
            <FormField
              defaultHelp={
                idx === 0 &&
                selectableDepartmentOptions.length === 0 &&
                helpWhenEmpty
              }
              disabled={disabled}
              label="Setor"
              name={`${field.name}-departmentId`}
              onValueChange={(value): void => {
                handlePositionFieldChange(field.id, "departmentId", value);
              }}
              options={selectableDepartmentOptions}
              required={required && idx === 0}
              rules={{
                required:
                  required &&
                  idx === 0 &&
                  (errorMessage || "Atribua uma posição ao colaborador"),
              }}
              type="select"
            />
          </Col>

          <Col span={idx === 0 ? 12 : 10}>
            <FormField
              disabled={disabled || !field.departmentId}
              label="Função"
              name={`${field.name}-positionId`}
              onValueChange={(value): void => {
                handlePositionFieldChange(field.id, "positionId", value);
              }}
              options={
                field.departmentId
                  ? getSelectablePositionOptions(field.departmentId)
                  : []
              }
              placeholder={
                !field.departmentId ? "Selecione o setor primeiro" : undefined
              }
              required={required && idx === 0}
              rules={{ required: required && idx === 0 }}
              type="select"
            />
          </Col>

          {idx !== 0 && (
            <Col className={classes.RemovePositionBtn} span={2}>
              <Button
                block={true}
                danger={true}
                icon={<DeleteOutlined />}
                onClick={(): void => {
                  handlePositionFieldRemove(field.id);
                }}
                type="dashed"
              />
            </Col>
          )}
        </Row>
      ))}

      <Button
        block={true}
        className={classes.AddPositionBtn}
        icon={<PlusOutlined />}
        onClick={handlePositionFieldAdd}
        type="dashed"
      >
        Adicionar outra posição
      </Button>
    </>
  );
}

function createBlankPositionField(): PositionField {
  const id = nanoid();

  return {
    departmentId: "",
    id,
    name: `position-${id}`,
    positionId: "",
  };
}

Na3PositionSelect.defaultProps = defaultProps;
