import { IdcardOutlined } from "@ant-design/icons";
import {
  Divider,
  Form,
  FormField,
  Na3PositionSelect,
  SubmitButton,
} from "@components";
import { useForm } from "@hooks";
import { useNa3Auth } from "@modules/na3-react";
import type { Na3PositionId } from "@modules/na3-types";
import { Col, notification, Row } from "antd";
import React, { useCallback } from "react";

type AdminCreateUserFormProps = {
  onSubmit?: () => void;
};

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  positionIds: Na3PositionId[];
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

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      middleName: "",
      registrationId: "",
    },
  });

  const handlePositionIdsChange = useCallback(
    (posIds: Na3PositionId[]) => {
      form.setValue("positionIds", posIds);
    },
    [form]
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
      positionIds,
    }: FormValues) => {
      const signUpRes = await signUp(registrationId, {
        email,
        firstName,
        lastName,
        middleName,
        positionIds,
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
    [form, signUp, onSubmit]
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

      <Na3PositionSelect onValueChange={handlePositionIdsChange} />

      <Divider />

      <SubmitButton label="Criar usuário" labelWhenLoading="Criando..." />
    </Form>
  );
}

AdminCreateUserForm.defaultProps = defaultProps;
