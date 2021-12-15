import { Result } from "@components";
import { Button } from "antd";
import React from "react";

type DocsStdAccessDeniedResultProps = {
  onNavigateBack: () => void;
};

export function DocsStdAccessDeniedResult({
  onNavigateBack,
}: DocsStdAccessDeniedResultProps): JSX.Element {
  return (
    <Result
      description="Você não tem acesso a este documento."
      extra={
        <Button onClick={onNavigateBack} type="primary">
          Voltar
        </Button>
      }
      status="error"
      title="Acesso restrito"
    />
  );
}
