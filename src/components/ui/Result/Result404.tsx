import { Button } from "antd";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { Spinner } from "../Spinner/Spinner";
import { Result } from "./Result";
import classes from "./Result404.module.css";

type Result404Props = {
  backUrl: `/${string}`;
  children: React.ReactNode;
  isLoading: boolean;
};

export function Result404({
  children,
  backUrl,
  isLoading,
}: Result404Props): JSX.Element {
  const history = useHistory();

  const handleNavigateBack = useCallback(() => {
    history.replace(backUrl);
  }, [history, backUrl]);

  const navigateBackBtn = useMemo(
    () => (
      <Button onClick={handleNavigateBack} type="primary">
        Voltar
      </Button>
    ),
    [handleNavigateBack]
  );

  return isLoading ? (
    <div className={classes.SpinnerContainer}>
      <Spinner text={null} />
    </div>
  ) : (
    <Result
      description={children}
      extra={navigateBackBtn}
      status="404"
      title="Oops!"
    />
  );
}
