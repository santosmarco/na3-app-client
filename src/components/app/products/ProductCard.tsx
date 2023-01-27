import { useNa3Departments } from "@modules/na3-react";
import type { Product } from "@schemas";
import React from "react";

import { DataCard } from "../../ui/DataCard/DataCard";
import { Tag } from "../../ui/Tag/Tag";

export type ProductCardProps = {
  data: Product & { id: string };
  onSelect: (product: Product & { id: string }) => void;
};

export function ProductCard({ data, onSelect }: ProductCardProps): JSX.Element {
  const {
    helpers: { getByDisplayName: getDptByDisplayName },
  } = useNa3Departments();

  return (
    <DataCard
      data={data}
      header={
        <div style={{ marginBottom: "0.5rem" }}>
          <Tag color={getDptByDisplayName(data.variant.kind)?.style.colors.web}>
            {data.variant.kind}
          </Tag>
        </div>
      }
      onClick={onSelect}
      preTitle={data.code.trim().toUpperCase()}
      title={data.name.trim().toUpperCase()}
    />
  );
}
