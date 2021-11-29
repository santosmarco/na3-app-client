import {
  DeleteOutlined,
  IdcardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Divider, Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useNa3Auth, useNa3Departments } from "@modules/na3-react";
import type { Na3DepartmentId, Na3PositionId } from "@modules/na3-types";
import { getDepartmentSelectOptions } from "@utils";
import { Button, Col, notification, Row } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useMemo, useState } from "react";

import classes from "./AdminCreateUserForm.module.css";

type AdminCreateUserFormProps = {
  onSubmit?: () => void;
};

type PositionField = {
  departmentId: Na3DepartmentId | "";
  id: string;
  name: `position-${string}`;
  positionId: Na3PositionId | "";
};

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  registrationId: string;
};

const defaultProps = {
  onSubmit: undefined,
};

export function AdminCreateUserForm({
  onSubmit,
}: AdminCreateUserFormProps): JSX.Element {
  const {
    helpers: { signUp },
  } = useNa3Auth();
  const departments = useNa3Departments();

  const [positionFields, setPositionFields] = useState<PositionField[]>([
    createBlankPositionField(),
  ]);

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      middleName: "",
      registrationId: "",
    },
  });

  const selectableDepartmentOptions = useMemo(
    () =>
      getDepartmentSelectOptions(
        departments.data?.filter(
          (dpt) =>
            !dpt.positions
              .map((pos) => pos.id)
              .every((posId) =>
                positionFields
                  .map((posField) => posField.positionId)
                  .includes(posId)
              )
        ) || []
      ),
    [departments.data, positionFields]
  );

  const getSelectablePositionOptions = useCallback(
    (departmentId: Na3DepartmentId) =>
      departments.helpers
        .getById(departmentId)
        ?.positions.filter(
          (pos) =>
            !positionFields
              .map((posField) => posField.positionId)
              .includes(pos.id)
        )
        .map((pos) => ({
          label: pos.shortName.trim().toUpperCase(),
          value: pos.id,
        })) || [],
    [departments.helpers, positionFields]
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

  const handleRegistrationIdBlur = useCallback(
    (value: string) => {
      form.setValue("registrationId", value.padStart(4, "0"));
    },
    [form]
  );

  const handleSubmit = useCallback(
    async ({
      email,
      firstName,
      lastName,
      middleName,
      registrationId,
    }: FormValues) => {
      const signUpRes = await signUp(registrationId, {
        email,
        firstName,
        lastName,
        middleName,
        positionIds: positionFields
          .map((posField) => posField.positionId)
          .filter((posId): posId is Na3PositionId => posId !== ""),
      });

      if (signUpRes.error) {
        notification.error({
          description: signUpRes.error.message,
          message: "Erro ao criar o usuário",
        });
      } else {
        notification.success({
          description: (
            <>
              Usuário <strong>{signUpRes.user.displayName}</strong>{" "}
              <em>(matrícula nº {signUpRes.user.registrationId})</em> criado com
              sucesso!
            </>
          ),
          message: "Usuário criado",
        });

        form.resetForm();
        onSubmit?.();
      }
    },
    [form, signUp, positionFields, onSubmit]
  );

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormField
        label="Matrícula"
        maxLength={4}
        name={form.fieldNames.registrationId}
        noDecimal={true}
        onBlur={handleRegistrationIdBlur}
        prefix={<IdcardOutlined />}
        rules={{
          required: "Forneça a matrícula do colaborador",
        }}
        type="number"
      />

      <Row gutter={16}>
        <Col lg={8} xs={24}>
          <FormField
            label="Primeiro nome"
            name={form.fieldNames.firstName}
            rules={{ required: true }}
            type="input"
          />
        </Col>

        <Col lg={8} xs={24}>
          <FormField
            label="Nome do meio"
            name={form.fieldNames.middleName}
            required={false}
            rules={null}
            type="input"
          />
        </Col>

        <Col lg={8} xs={24}>
          <FormField
            label="Último nome"
            name={form.fieldNames.lastName}
            rules={{ required: true }}
            type="input"
          />
        </Col>
      </Row>

      <FormField
        label="E-mail"
        name={form.fieldNames.email}
        required={false}
        rules={{
          pattern: {
            message: "E-mail inválido",
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
          },
        }}
        type="input"
      />

      <Divider />

      {positionFields.map((field, idx) => (
        <Row align="bottom" gutter={{ xs: 6, lg: 16 }} key={field.id}>
          <Col lg={12} xs={11}>
            <FormField
              label="Setor"
              name={`${field.name}-departmentId`}
              onValueChange={(value): void =>
                handlePositionFieldChange(field.id, "departmentId", value)
              }
              options={selectableDepartmentOptions}
              required={idx === 0}
              rules={{
                required: idx === 0 && "Atribua uma posição ao colaborador",
              }}
              type="select"
            />
          </Col>

          <Col lg={idx === 0 ? 12 : 10} xs={idx === 0 ? 13 : 10}>
            <FormField
              disabled={!field.departmentId}
              label="Função"
              name={`${field.name}-positionId`}
              onValueChange={(value): void =>
                handlePositionFieldChange(field.id, "positionId", value)
              }
              options={
                field.departmentId
                  ? getSelectablePositionOptions(field.departmentId)
                  : []
              }
              placeholder={
                !field.departmentId ? "Atribua o setor primeiro" : undefined
              }
              required={idx === 0}
              rules={{ required: idx === 0 }}
              type="select"
            />
          </Col>

          {idx !== 0 && (
            <Col className={classes.RemovePositionBtn} lg={2} xs={3}>
              <Button
                block={true}
                danger={true}
                icon={<DeleteOutlined />}
                onClick={(): void => handlePositionFieldRemove(field.id)}
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

      <Divider />

      <SubmitButton label="Criar usuário" labelWhenLoading="Criando..." />
    </Form>
  );
}

AdminCreateUserForm.defaultProps = defaultProps;

function createBlankPositionField(): PositionField {
  const id = nanoid();

  return {
    departmentId: "",
    id,
    name: `position-${id}`,
    positionId: "",
  };
}
