import { useQuery } from "@hooks";
import React from "react";
import { Redirect } from "react-router-dom";

import { UserProfilePage } from "./UserProfile";

export function UsersHomePage(): JSX.Element {
  const query = useQuery("matricula");

  return query.matricula ? (
    <UserProfilePage registrationId={query.matricula} />
  ) : (
    <Redirect to="/" />
  );
}
