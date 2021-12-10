import { IdcardOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import {
  Form,
  FormField,
  Page,
  PageAlert,
  PageDescription,
  PageTitle,
  SubmitButton,
} from "@components";
import { useForm } from "@hooks";
import { useNa3Auth } from "@modules/na3-react";
import { message } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

type PageProps = {
  redirectUrl?: string;
};

type AuthFormValues = {
  password: string;
  registrationId: string;
};

export function AuthPage({ redirectUrl }: PageProps): JSX.Element {
  const history = useHistory();

  const {
    helpers: { signIn },
    currentUser,
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
        redirectUrl && history.replace(redirectUrl);
      }
    },
    [form, signIn, history, redirectUrl]
  );

  const handleRegistrationIdBlur = useCallback(
    (value: string) => {
      form.setValue("registrationId", value.padStart(4, "0"));
    },
    [form]
  );

  return (
    <Page>
      <PageTitle>Entrar</PageTitle>

      {currentUser && (
        <PageAlert type="warning">
          Você não possui acesso a esta área.
        </PageAlert>
      )}

      <PageDescription>
        Por favor, {currentUser ? "troque de conta" : "autentique-se"} para
        continuar.
      </PageDescription>

      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Matrícula"
          labelCol={{ span: 6 }}
          maxLength={4}
          name={form.fieldNames.registrationId}
          noDecimal={true}
          onBlur={handleRegistrationIdBlur}
          prefix={<IdcardOutlined />}
          rules={{
            required: "Digite sua matrícula",
          }}
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
    </Page>
  );
}
