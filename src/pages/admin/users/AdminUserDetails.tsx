import { PageDescription, PageTitle, Result404 } from "@components";
import { useNa3Users } from "@modules/na3-react";
import type { Na3User } from "@modules/na3-types";
import React from "react";

type PageProps = {
  backUrl?: `/${string}`;
  user: Na3User | undefined;
};

export function AdminUserDetailsPage({
  user,
  backUrl,
}: PageProps): JSX.Element {
  const { loading } = useNa3Users();

  return user ? (
    <>
      <PageTitle>{user.displayName}</PageTitle>
      <PageDescription></PageDescription>
    </>
  ) : (
    <Result404 backUrl={backUrl || "/"} isLoading={loading}>
      A conta requisitada não existe ou foi desabilitada.
    </Result404>
  );
}
