import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FormField } from "@components";
import { useNa3Departments, useNa3Users } from "@modules/na3-react";
import type {
  Na3DepartmentId,
  Na3PositionId,
  Na3PositionIdBase,
} from "@modules/na3-types";
import {
  getDepartmentSelectOptions,
  handleFilterDuplicates,
  handleFilterFalsies,
} from "@utils";
import { Button, Col, Row } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

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
  defaultValue?: Na3PositionId[];
  onValueChange?: (positionIds: Na3PositionId[]) => void;
  selectablePositions?: Na3PositionId[];
  required?: boolean;
  disabled?: boolean;
};

const defaultProps = {
  required: true,
};

export function Na3PositionSelect({
  defaultValue,
  onValueChange,
  errorMessage,
  selectablePositions: selectablePosProp,
  helpWhenEmpty,
  required,
  disabled,
}: Na3PositionSelectProps): JSX.Element {
  const departments = useNa3Departments();
  const users = useNa3Users();

  const [positionFields, setPositionFields] = useState<PositionField[]>(
    defaultValue
      ? defaultValue.map(createPositionField)
      : [createPositionField()]
  );

  const formCtx = useFormContext();

  const selectablePositions = useMemo((): Na3PositionId[] => {
    if (defaultValue || selectablePosProp) {
      return [...(defaultValue || []), ...(selectablePosProp || [])];
    }
    return (departments.data || [])
      .flatMap((dpt) => dpt.positions)
      .map((pos) => pos.id)
      .filter(handleFilterDuplicates);
  }, [departments.data, defaultValue, selectablePosProp]);

  const selectableDepartmentOptions = useMemo(() => {
    const dptIds = selectablePositions
      .map((pos) => departments.helpers.splitPositionId(pos)[0])
      .filter(handleFilterDuplicates);

    const dpts = dptIds
      .map((dptId) => departments.helpers.getById(dptId))
      .filter(handleFilterFalsies);

    return getDepartmentSelectOptions(dpts).map((opt) => ({
      ...opt,
      options: opt.options.map((subOpt) => {
        const dpt = departments.helpers.getById(subOpt.value);
        const allDptPositionsAreSelected = (dpt?.positions || [])
          .filter((pos) => {
            const posIsSelectable = selectablePositions.includes(pos.id);
            return posIsSelectable;
          })
          .every((pos) =>
            positionFields
              .map((posField) => posField.positionId)
              .includes(pos.id)
          );

        return { ...subOpt, disabled: allDptPositionsAreSelected };
      }),
    }));
  }, [selectablePositions, positionFields, departments.helpers]);

  const getSelectablePositionOptions = useCallback(
    (departmentId: Na3DepartmentId) => {
      const dpt = departments.helpers.getById(departmentId);

      if (!dpt) {
        return [];
      }

      return dpt.positions
        .filter((pos) => {
          const posIsSelectable = selectablePositions.includes(pos.id);
          return posIsSelectable;
        })
        .map((pos) => {
          const posIsAlreadySelected = positionFields
            .map((posField) => posField.positionId)
            .includes(pos.id);

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
            disabled: posIsAlreadySelected,
          };
        });
    },
    [departments.helpers, users.helpers, positionFields, selectablePositions]
  );

  const handlePositionFieldAdd = useCallback(() => {
    setPositionFields((curr) => [...curr, createPositionField()]);
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
      value: Exclude<PositionField[T], ""> | undefined
    ) => {
      const fieldIdx = positionFields.findIndex(
        (field) => field.id === fieldId
      );
      const field = positionFields[fieldIdx];

      // If current field value differs from new value, update field.
      if (field[valueKey] !== value) {
        // Update field in state.
        setPositionFields((curr) => {
          return [
            ...curr.slice(0, fieldIdx),
            { ...curr[fieldIdx], positionId: "", [valueKey]: value || "" },
            ...curr.slice(fieldIdx + 1),
          ];
        });
        // If the change comes from a dptId field, also clear the
        // positionId value in form to prevent selecting an
        // invalid position.
        if (valueKey === "departmentId") {
          formCtx.setValue(`${field.name}-positionId`, "");
        }
      }
    },
    [positionFields, formCtx]
  );

  const checkFieldIsRequired = useCallback(
    (rowIdx: number): boolean => {
      // If the entire component is set to be disabled, all fields
      // should be marked as required.
      if (disabled) {
        return true;
      }
      // Otherwise, only mark the field as required if the component itself
      // is marked as required and we're checking on the first row of fields.
      if (required && rowIdx === 0) {
        return true;
      }
      // Else, no field should be marked as required.
      return false;
    },
    [disabled, required]
  );

  const checkRemoveBtnIsVisible = useCallback(
    (rowIdx: number): boolean => {
      // If the entire component is set to be disabled, there's no remove btn.
      if (disabled) {
        return false;
      }
      // Otherwise, there will be always a remove btn for any row except
      // for the first one.
      return rowIdx > 0;
    },
    [disabled]
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
        <Row gutter={{ xs: 3, sm: 4, md: 6, lg: 10 }} key={field.id}>
          <Col span={12}>
            <FormField
              defaultHelp={
                idx === 0 &&
                selectableDepartmentOptions.length === 0 &&
                helpWhenEmpty
              }
              defaultValue={
                defaultValue?.map(
                  (posId) => departments.helpers.splitPositionId(posId)[0]
                )[idx]
              }
              disabled={disabled}
              label="Setor"
              name={`${field.name}-departmentId`}
              onValueChange={(value): void => {
                handlePositionFieldChange(field.id, "departmentId", value);
              }}
              options={selectableDepartmentOptions}
              required={checkFieldIsRequired(idx)}
              rules={{
                required:
                  checkFieldIsRequired(idx) &&
                  (errorMessage || "Atribua uma posição ao colaborador"),
              }}
              type="select"
            />
          </Col>

          <Col span={checkRemoveBtnIsVisible(idx) ? 10 : 12}>
            <FormField
              defaultValue={defaultValue?.[idx]}
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
              required={checkFieldIsRequired(idx)}
              rules={{ required: checkFieldIsRequired(idx) }}
              type="select"
            />
          </Col>

          {checkRemoveBtnIsVisible(idx) && (
            <Col className={classes.RemovePositionBtn} span={2}>
              <Button
                block={true}
                danger={true}
                disabled={disabled}
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
        disabled={disabled}
        icon={<PlusOutlined />}
        onClick={handlePositionFieldAdd}
        type="dashed"
      >
        Adicionar outra posição
      </Button>
    </>
  );
}

function createPositionField(positionId?: Na3PositionId): PositionField {
  const id = nanoid();
  const name: `position-${string}` = `position-${id}`;

  const baseField = { id, name };

  if (positionId) {
    const [departmentId] = positionId.split(".") as [
      Na3DepartmentId,
      Na3PositionIdBase
    ];
    return { ...baseField, departmentId, positionId };
  }
  return { ...baseField, departmentId: "", positionId: "" };
}

Na3PositionSelect.defaultProps = defaultProps;
