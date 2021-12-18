import { gold } from "@ant-design/colors";
import { LockOutlined } from "@ant-design/icons";
import { Form, FormField, FormItem, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useCurrentUser } from "@modules/na3-react";
import {
  Alert,
  message,
  Modal,
  notification,
  Progress,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import validator from "validator";

import classes from "./ChangePwdModal.module.css";
import { PwdChecklistItem } from "./PwdChecklistItem";

type PwdComponents = "digit" | "lower" | "upper";

type PwdStrengthLevel =
  | "regular"
  | "strong"
  | "veryStrong"
  | "veryWeak"
  | "weak";

type ResetPwdFormValues = {
  pwd: string;
  pwdConfirm: string;
};

export function ChangePwdModal(): JSX.Element {
  const user = useCurrentUser();

  const [isVisible, setIsVisible] = useState(user?.isPasswordDefault);

  const form = useForm<ResetPwdFormValues>({
    defaultValues: { pwd: "", pwdConfirm: "" },
  });

  const [pwdInput, setPwdInput] = useState("");
  const [pwdHasAllComponents, setPwdHasAllComponents] = useState(false);

  const pwdStrength = useMemo((): number => {
    const strength = validator.isStrongPassword(pwdInput, {
      returnScore: true,
      pointsPerUnique: pwdHasAllComponents ? 5 : 0.5,
      pointsForContainingLower: pwdHasAllComponents ? 10 : 2,
      pointsForContainingUpper: pwdHasAllComponents ? 10 : 2,
      pointsForContainingNumber: pwdHasAllComponents ? 10 : 2,
      pointsPerRepeat: 0.5,
      pointsForContainingSymbol: 0,
    }) as unknown as number;
    return strength > 100 ? 100 : strength;
  }, [pwdInput, pwdHasAllComponents]);

  const pwdStrengthLevel = useMemo((): PwdStrengthLevel | undefined => {
    if (pwdStrength === 0) return;
    if (!pwdHasAllComponents || pwdStrength <= 20) return "veryWeak";
    if (pwdStrength <= 40) return "weak";
    if (pwdStrength <= 60) return "regular";
    if (pwdStrength <= 80) return "strong";
    return "veryStrong";
  }, [pwdHasAllComponents, pwdStrength]);

  const isPwdRegular = useMemo(
    (): boolean =>
      !!pwdStrengthLevel &&
      ["regular", "strong", "veryStrong"].includes(pwdStrengthLevel),
    [pwdStrengthLevel]
  );

  const isPwdStrong = useMemo(
    (): boolean =>
      !!pwdStrengthLevel && ["strong", "veryStrong"].includes(pwdStrengthLevel),
    [pwdStrengthLevel]
  );

  const isPwdVeryStrong = useMemo(
    (): boolean =>
      !!pwdStrengthLevel && ["veryStrong"].includes(pwdStrengthLevel),
    [pwdStrengthLevel]
  );

  const pwdStrengthMessage = useMemo((): string | undefined => {
    if (!pwdStrengthLevel) return;
    return {
      veryWeak: "Muito fraca",
      weak: "Fraca",
      regular: "Regular",
      strong: "Forte",
      veryStrong: "Muito forte",
    }[pwdStrengthLevel];
  }, [pwdStrengthLevel]);

  const pwdContains = useCallback(
    (pwd: string, query: PwdComponents | "8+"): boolean => {
      switch (query) {
        case "8+":
          return pwd.trim().length >= 8;
        case "lower":
          return /(?=.*[a-z])/.test(pwd);
        case "upper":
          return /(?=.*[A-Z])/.test(pwd);
        case "digit":
          return /(?=.*[0-9])/.test(pwd);
      }
    },
    []
  );

  const handlePwdValidate = useCallback(
    (
      pwd: string,
      options?: { skipMinLength?: boolean }
    ): string | undefined => {
      const notFound: string[] = [];

      if (!pwdContains(pwd, "8+") && !options?.skipMinLength)
        notFound.push("oito caracteres");
      if (!pwdContains(pwd, "lower"))
        notFound.push("uma letra minúscula (a-z)");
      if (!pwdContains(pwd, "upper"))
        notFound.push("uma letra maiúscula (A-Z)");
      if (!pwdContains(pwd, "digit")) notFound.push("um dígito (0-9)");

      if (notFound.length === 0) return;
      if (notFound.length === 1) return `Deve conter pelo menos ${notFound[0]}`;
      return `Deve conter pelo menos ${notFound
        .slice(0, notFound.length - 1)
        .join(", ")} e ${notFound[notFound.length - 1]}`;
    },
    [pwdContains]
  );

  const handlePwdChange = useCallback(
    (pwd: string): void => {
      setPwdInput(pwd.trim());
      setPwdHasAllComponents(!handlePwdValidate(pwd, { skipMinLength: true }));
    },
    [handlePwdValidate]
  );

  const handlePwdConfirmValidate = useCallback(
    (pwdConfirm: string): string | undefined => {
      return pwdInput !== pwdConfirm ? "As senhas não conferem" : undefined;
    },
    [pwdInput]
  );

  const handleSubmit = useCallback(
    async ({ pwd }: ResetPwdFormValues) => {
      if (!user) return;

      const { error, warning } = await user.updatePassword(pwd);

      if (error) {
        notification.error({
          message: "Erro ao redefinir a senha",
          description: error.message,
        });
        return;
      } else if (warning) {
        notification.warn({
          message: warning.title,
          description: warning.message,
        });
      } else {
        void message.success("Senha atualizada");
      }

      setIsVisible(false);
    },
    [user]
  );

  useEffect(() => {
    if (user?.isPasswordDefault) {
      setIsVisible(true);
    }
  }, [user?.isPasswordDefault]);

  return (
    <Modal
      closable={false}
      footer={null}
      title="Redefinir senha"
      visible={isVisible}
    >
      <Alert
        className={classes.Alert}
        description="Por favor, defina uma nova senha para continuar."
        message="Atualize sua senha"
        showIcon={true}
        type="warning"
      />

      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Nova senha"
          name={form.fieldNames.pwd}
          onValueChange={handlePwdChange}
          prefix={<LockOutlined />}
          rules={{ required: true, validate: handlePwdValidate }}
          tooltip={{
            content: (
              <>
                <PwdChecklistItem isValid={pwdContains(pwdInput, "8+")}>
                  8+ caracteres
                </PwdChecklistItem>
                <PwdChecklistItem isValid={pwdContains(pwdInput, "lower")}>
                  1 letra minúscula
                </PwdChecklistItem>
                <PwdChecklistItem isValid={pwdContains(pwdInput, "upper")}>
                  1 letra maiúscula
                </PwdChecklistItem>
                <PwdChecklistItem isValid={pwdContains(pwdInput, "digit")}>
                  1 dígito
                </PwdChecklistItem>
              </>
            ),
          }}
          type="password"
        />

        <FormField
          label="Confirmar senha"
          name={form.fieldNames.pwdConfirm}
          prefix={<LockOutlined />}
          rules={{ required: true, validate: handlePwdConfirmValidate }}
          type="password"
        />

        <FormItem>
          <div
            className={isPwdStrong ? classes.StrengthBarContainer : undefined}
          >
            <Progress
              percent={pwdStrength}
              showInfo={isPwdStrong}
              size="small"
              status={isPwdStrong ? "success" : "active"}
              strokeColor={!isPwdRegular ? gold[6] : undefined}
            />
          </div>
          <Typography.Text
            className={classes.StrengthMessage}
            italic={!isPwdVeryStrong}
            strong={isPwdVeryStrong}
            type={isPwdStrong ? "success" : "secondary"}
          >
            {pwdStrengthMessage || "Força da senha"}
          </Typography.Text>
        </FormItem>

        <SubmitButton label="Redefinir senha" labelWhenLoading="Enviando..." />
      </Form>
    </Modal>
  );
}
