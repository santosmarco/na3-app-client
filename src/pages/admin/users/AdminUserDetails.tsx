import { PageDescription, PageTitle, Result404 } from "@components";
import type { AppRoutePath } from "@config";
import type { AppUser } from "@modules/na3-react";
import { useNa3Users } from "@modules/na3-react";
import React from "react";

type PageProps = {
  backUrl?: AppRoutePath;
  user: AppUser | undefined;
};

export function AdminUserDetailsPage({
  user,
  backUrl,
}: PageProps): JSX.Element {
  const { loading } = useNa3Users();

  return user ? (
    <>
      <PageTitle>{user.displayName}</PageTitle>
      <PageDescription>Em construção</PageDescription>
    </>
  ) : (
    <Result404 backUrl={backUrl || "/"} isLoading={loading}>
      A conta requisitada não existe ou foi desabilitada.
    </Result404>
  );
}
