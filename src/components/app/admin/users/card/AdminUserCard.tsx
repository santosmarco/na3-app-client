import { DataCard } from "@components";
import type { AppUser } from "@modules/na3-react";
import React from "react";

type AdminUserCardProps = {
  data: AppUser;
  onSelect: (user: AppUser) => void;
};

export function AdminUserCard({
  data,
  onSelect,
}: AdminUserCardProps): JSX.Element {
  return (
    <DataCard
      data={data}
      onClick={onSelect}
      preTitle={`#${data.registrationId}`}
      title={data.displayName}
    />
  );
}
