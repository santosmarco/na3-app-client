import { IdcardOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import {
  Form,
  FormField,
  PageDescription,
  PageTitle,
  SubmitButton,
} from "@components";
import { useForm } from "@hooks";
import { useNa3Auth } from "@modules/na3-react";
import { message } from "antd";
import React, { useCallback } from "react";

type AuthFormValues = {
  password: string;
  registrationId: string;
};

export function AuthPage(): JSX.Element {
  const {
    helpers: { signIn },
  } = useNa3Auth();

  const form = useForm<AuthFormValues>({
    defaultValues: { password: "", registrationId: "" },
  });

  const handleSubmit = useCallback(
    async ({ password, registrationId }: AuthFormValues) => {
      const { error } = await signIn(registrationId, password);

      if (error) {
        switch (error.code) {
          case "auth/user-not-found":
            form.setError("registrationId", {
              message: "Não existe uma conta para a matrícula informada.",
            });
            break;

          default:
            form.setError("password", { message: error.message });
        }
      } else {
        void message.success("Autenticado");
      }
    },
    [form, signIn]
  );

  return (
    <>
      <PageTitle>Entrar</PageTitle>
      <PageDescription>
        Por favor, autentique-se para continuar.
      </PageDescription>

      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Matrícula"
          labelCol={{ span: 6 }}
          name={form.fieldNames.registrationId}
          noDecimal={true}
          prefix={<IdcardOutlined />}
          rules={{ required: "Digite sua matrícula" }}
          tooltip={{
            arrowPointAtCenter: true,
            placement: "topLeft",
            title:
              "Para solicitar uma conta, entre em contato com o administrador do sistema",
          }}
          type="number"
        />

        <FormField
          label="Senha"
          labelCol={{ span: 6 }}
          name={form.fieldNames.password}
          prefix={<LockOutlined />}
          rules={{ required: "Digite sua senha" }}
          type="password"
        />

        <SubmitButton
          icon={<LoginOutlined />}
          label="Entrar"
          labelWhenLoading="Entrando..."
          wrapperCol={{ sm: { offset: 6, span: 18 }, xs: { span: 24 } }}
        />
      </Form>
    </>
  );
}
