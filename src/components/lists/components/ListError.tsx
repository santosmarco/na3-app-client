import { Result } from "@components";
import React from "react";

import { ListErrorButtons } from "./ListErrorButtons";

type ListErrorProps = {
  children: React.ReactNode;
};

export function ListError({ children }: ListErrorProps): JSX.Element {
  return (
    <Result
      description={children}
      extra={<ListErrorButtons />}
      status="warning"
      title="Não foi possível carregar"
    />
  );
}
