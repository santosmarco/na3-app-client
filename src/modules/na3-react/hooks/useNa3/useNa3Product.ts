import { useCallback, useEffect, useState } from "react";

import type { ControllerResult, Na3Product } from "../../../na3";
import { na3 } from "../../../na3";
import type { Na3ApiPerson, Na3ApiProduct } from "../../../na3-types";

export type ProductData = Na3ApiProduct &
  Omit<Na3Product, "getCustomers"> & {
    getCustomers: () => Promise<Na3ApiPerson[]>;
  };

type UseNa3ProductResult = {
  data: ProductData | undefined;
  error: string | undefined;
  loading: boolean;
};

export function useNa3Product(query: string): UseNa3ProductResult {
  const [product, setProduct] = useState<ProductData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFetchProduct = useCallback(
    async (fetchFunction: () => Promise<ControllerResult<Na3Product>>) => {
      setError(undefined);
      setProduct(undefined);
      setLoading(true);
      const fetchResult = await fetchFunction();
      fetchResult.data
        ? setProduct({
            ...fetchResult.data.get(),
            get: () => fetchResult.data.get(),
            getCustomers: () =>
              fetchResult.data.getCustomers({ ignoreErrors: true }),
          })
        : setError(fetchResult.error.message);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    const typoFixedQuery = na3.products.utils.fixQuery(query);
    if (na3.products.isProductId(typoFixedQuery)) {
      void handleFetchProduct(async () => na3.products.getById(typoFixedQuery));
    } else if (na3.products.isProductCode(typoFixedQuery)) {
      void handleFetchProduct(async () =>
        na3.products.getByCode(typoFixedQuery)
      );
    } else {
      setLoading(false);
      setProduct(undefined);
      if (!typoFixedQuery) {
        setError("Nenhum ID ou código de produto fornecido.");
      } else setError("ID ou código de produto inválido.");
    }
  }, [query, handleFetchProduct]);

  return { data: product, error, loading };
}
