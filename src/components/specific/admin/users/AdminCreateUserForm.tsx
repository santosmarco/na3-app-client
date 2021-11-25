import {
  DeleteOutlined,
  IdcardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useState } from "react";

import { useForm } from "../../../../hooks";
import { useNa3Auth, useNa3Departments } from "../../../../modules/na3-react";
import type {
  Na3DepartmentId,
  Na3PositionId,
} from "../../../../modules/na3-types";
import { getDepartmentSelectOptions } from "../../../../utils";
import { Form } from "../../../forms/Form";
import { FormField } from "../../../forms/FormField/FormField";
import { SubmitButton } from "../../../forms/SubmitButton";
import { Divider } from "../../../ui/Divider/Divider";
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
  const auth = useNa3Auth();
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

  const handleSubmit = useCallback(
    async ({
      email,
      firstName,
      lastName,
      middleName,
      registrationId,
    }: FormValues) => {
      const { error } = await auth.helpers.signUp(registrationId, {
        email,
        firstName,
        lastName,
        middleName,
        positionIds: positionFields
          .map((posField) => posField.positionId)
          .filter((posId): posId is Na3PositionId => posId !== ""),
      });

      onSubmit?.();
      return;
    },
    [auth.helpers, positionFields, onSubmit]
  );

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormField
        label="Matrícula"
        maxLength={3}
        name={form.fieldNames.registrationId}
        noDecimal={true}
        prefix={<IdcardOutlined />}
        rules={{
          minLength: { message: "Matrícula inválida", value: 3 },
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
        rules={{
          pattern: {
            message: "E-mail inválido",
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
          },
          required: "Forneça o e-mail do colaborador",
        }}
        type="input"
      />

      <Divider />

      {positionFields.map((field, idx) => (
        <Row align="bottom" gutter={16} key={field.id}>
          <Col span={12}>
            <FormField
              label="Setor"
              name={`${field.name}-departmentId`}
              onValueChange={(value): void =>
                handlePositionFieldChange(field.id, "departmentId", value)
              }
              options={getDepartmentSelectOptions(departments.data || [])}
              required={idx === 0}
              rules={{
                required: idx === 0 && "Atribua uma posição ao colaborador",
              }}
              type="select"
            />
          </Col>

          <Col span={idx === 0 ? 12 : 10}>
            <FormField
              disabled={!field.departmentId}
              label="Função"
              name={`${field.name}-positionId`}
              options={(
                departments.helpers.getById(field.departmentId)?.positions || []
              ).map((pos) => ({
                label: pos.name.trim().toUpperCase(),
                value: pos.id,
              }))}
              placeholder={
                !field.departmentId ? "Atribua o setor primeiro" : undefined
              }
              required={idx === 0}
              rules={{ required: idx === 0 }}
              type="select"
            />
          </Col>

          {idx !== 0 && (
            <Col className={classes.RemovePositionBtn} span={2}>
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
        icon={<PlusOutlined />}
        onClick={handlePositionFieldAdd}
        type="dashed"
      >
        Adicionar outra posição
      </Button>

      <Divider />

      <SubmitButton label="Criar usuário" labelWhenLoading="Ciando..." />
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
