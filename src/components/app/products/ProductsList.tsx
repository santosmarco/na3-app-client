import { useNa3NativeProducts } from "@modules/na3-react/hooks";
import type { Product } from "@schemas";
import React, { useCallback } from "react";

import { List } from "../../lists/List";
import { ProductCard } from "./ProductCard";

type ProductsListProps = {
  data: Array<Product & { id: string }>;
  onSelectProduct: (product: Product & { id: string }) => void;
};

export function ProductsList({
  data,
  onSelectProduct: onSelectTemplate,
}: ProductsListProps): JSX.Element {
  const { error, loading } = useNa3NativeProducts();

  const handleRenderItem = useCallback(
    (item: Product & { id: string }) => (
      <ProductCard data={item} onSelect={onSelectTemplate} />
    ),
    [onSelectTemplate]
  );

  const handleFilterItem = useCallback(
    (query: string): Array<Product & { id: string }> =>
      data.filter((product) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          product.name.toLowerCase().includes(formattedQuery) ||
          product.description?.toLowerCase().includes(formattedQuery) ||
          product.code.toLowerCase().includes(formattedQuery) ||
          product.variant.kind.toLowerCase().includes(formattedQuery)
        );
      }),
    [data]
  );

  return (
    <List
      data={data}
      error={error?.message}
      filterItem={handleFilterItem}
      isLoading={loading}
      renderItem={handleRenderItem}
      verticalSpacing={8}
    />
  );
}
