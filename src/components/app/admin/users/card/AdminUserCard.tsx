import { DataCard } from "@components";
import type { Na3User } from "@modules/na3-types";
import React from "react";

type AdminUserCardProps = {
  data: Na3User;
  onSelect: (user: Na3User) => void;
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
