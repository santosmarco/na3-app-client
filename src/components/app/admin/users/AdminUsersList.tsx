import { AdminUserCard, List } from "@components";
import type { Na3User } from "@modules/na3-types";
import React, { useCallback } from "react";

type AdminUsersListProps = {
  data: Na3User[] | null;
  error: string | null | undefined;
  loading: boolean;
  onSelectUser: (user: Na3User) => void;
};

export function AdminUsersList({
  data,
  error,
  loading,
  onSelectUser,
}: AdminUsersListProps): JSX.Element {
  const handleRenderItem = useCallback(
    (user: Na3User) => <AdminUserCard data={user} onSelect={onSelectUser} />,
    [onSelectUser]
  );

  const handleFilterItemOnSearch = useCallback(
    (query: string): Na3User[] =>
      data?.filter((user) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          user.firstName.toLowerCase().includes(formattedQuery) ||
          user.middleName?.toLowerCase().includes(formattedQuery) ||
          user.lastName.toLowerCase().includes(formattedQuery) ||
          user.displayName.toLowerCase().includes(formattedQuery) ||
          user.email?.toLowerCase().includes(formattedQuery)
        );
      }) || [],
    [data]
  );

  return (
    <List
      data={data}
      error={error}
      filterItem={handleFilterItemOnSearch}
      isLoading={loading}
      renderItem={handleRenderItem}
      verticalSpacing={8}
    />
  );
}
