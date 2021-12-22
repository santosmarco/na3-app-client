import { Button } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Result } from "./Result";

export function ResultSignIn(): JSX.Element {
  const history = useHistory();

  const handleAuthRedirect = useCallback(() => {
    history.push("/entrar");
  }, [history]);

  return (
    <Result
      description="Você precisa entrar primeiro."
      extra={
        <Button onClick={handleAuthRedirect} type="primary">
          Entrar
        </Button>
      }
      status="warning"
      title="Área restrita"
    />
  );
}
