import type { AppRoutePath } from "@config";
import { Button } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

import { Spinner } from "../Spinner/Spinner";
import { Result } from "./Result";
import classes from "./Result404.module.css";

type Result404Props = {
  backBtnLabel?: string;
  backUrl: AppRoutePath;
  children: React.ReactNode;
  isLoading: boolean;
};

const defaultProps = {
  backBtnLabel: undefined,
};

export function Result404({
  children,
  backUrl,
  isLoading,
  backBtnLabel,
}: Result404Props): JSX.Element {
  const history = useHistory();

  const handleNavigateBack = useCallback(() => {
    history.replace(backUrl as string);
  }, [history, backUrl]);

  return isLoading ? (
    <div className={classes.SpinnerContainer}>
      <Spinner text={null} />
    </div>
  ) : (
    <Result
      description={children}
      extra={
        <Button onClick={handleNavigateBack} type="primary">
          {backBtnLabel || "Voltar"}
        </Button>
      }
      status="404"
      title="Oops!"
    />
  );
}

Result404.defaultProps = defaultProps;
