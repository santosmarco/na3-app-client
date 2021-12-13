import { Result } from "@components";
import { Button } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function NotImplementedPage(): JSX.Element {
  const history = useHistory();

  const handleBackToHome = useCallback(() => {
    history.push("/");
  }, [history]);

  return (
    <Result
      description="Desculpe, esta página ainda não foi implementada."
      extra={<Button onClick={handleBackToHome}>Voltar ao Início</Button>}
      status="500"
      title="500"
    />
  );
}
