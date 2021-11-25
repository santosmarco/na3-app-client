import { useLocation } from "react-router-dom";

export const useQuery = <Param extends string>(
  params: Param | Param[]
): Record<Param, string | null> => {
  params = typeof params === "string" ? [params] : params;

  const location = useLocation();

  const query = new URLSearchParams(location.search);

  return params.reduce(
    (result, param) => ({ ...result, [param]: query.get(param) }),
    {} as Record<Param, string | null>
  );
};
