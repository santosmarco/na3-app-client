import { useCallback } from "react";
import type { LiteralUnion } from "type-fest";

import type { FirebaseError } from "../../firebase-errors-pt-br";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
} from "../../na3-types";
import { useStateSlice } from "./useStateSlice";

export type UseNa3DepartmentsResult = {
  data: Na3Department[] | null;
  error: FirebaseError | null;
  helpers: {
    getByDisplayName: (displayName: string) => Na3Department | undefined;
    getById: <T extends Na3DepartmentType = Na3DepartmentType>(
      id: LiteralUnion<Na3DepartmentId<T>, string>
    ) => Na3Department<T> | undefined;
    getByIdsOrTypes: (
      idsOrTypes: (Na3DepartmentId | Na3DepartmentType)[]
    ) => Na3Department[] | undefined;
    getByType: <T extends Na3DepartmentType>(
      type: T
    ) => Na3Department<T>[] | undefined;
    getDptTypeName: (
      type: Na3DepartmentType
    ) => "Fábrica" | "Filial" | "Setores";
    isDptType: (type: unknown) => type is Na3DepartmentType;
  };
  loading: boolean;
};

export function useNa3Departments(): UseNa3DepartmentsResult {
  const departments = useStateSlice("departments");

  const getBy = useCallback(
    <
      T extends "displayName" | "id",
      U extends Na3DepartmentType = Na3DepartmentType
    >(
      attr: T,
      value: T extends "id" ? LiteralUnion<Na3DepartmentId<U>, string> : string
    ): Na3Department<U> | undefined =>
      departments.data?.find(
        (dpt) =>
          value && dpt[attr].toLowerCase().trim() === value.toLowerCase().trim()
      ) as Na3Department<U> | undefined,
    [departments.data]
  );

  const getById = useCallback(
    <T extends Na3DepartmentType = Na3DepartmentType>(
      id: LiteralUnion<Na3DepartmentId<T>, string>
    ) => getBy("id", id),
    [getBy]
  );

  const getByDisplayName = useCallback(
    (displayName: string): Na3Department | undefined =>
      getBy("displayName", displayName),
    [getBy]
  );

  const getByType = useCallback(
    <T extends Na3DepartmentType>(type: T): Na3Department<T>[] | undefined =>
      departments.data?.filter(
        (dpt): dpt is Na3Department<T> => dpt.type === type
      ),
    [departments.data]
  );

  const getByIdsOrTypes = useCallback(
    (
      idsOrTypes: (Na3DepartmentId | Na3DepartmentType)[]
    ): Na3Department[] | undefined =>
      departments.data?.filter(
        (dpt) => idsOrTypes.includes(dpt.type) || idsOrTypes.includes(dpt.id)
      ),
    [departments.data]
  );

  const getDptTypeName = useCallback(
    (type: Na3DepartmentType): "Fábrica" | "Filial" | "Setores" => {
      switch (type) {
        case "shop-floor":
          return "Setores";
        case "factory-adm":
          return "Fábrica";
        case "office":
          return "Filial";
      }
    },
    []
  );

  const isDptType = useCallback((type: unknown): type is Na3DepartmentType => {
    return (
      typeof type === "string" &&
      ["factory-adm", "office", "shop-floor"].includes(type)
    );
  }, []);

  return {
    ...departments,
    helpers: {
      getByDisplayName,
      getById,
      getByIdsOrTypes,
      getByType,
      getDptTypeName,
      isDptType,
    },
  };
}
