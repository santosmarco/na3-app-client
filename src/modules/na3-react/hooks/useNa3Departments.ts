import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3DepartmentType,
  Na3Machine,
  Na3PositionId,
} from "@modules/na3-types";
import { isArray } from "lodash";
import { useCallback } from "react";
import type { LiteralUnion } from "type-fest";

import type { MaybeArray } from "../types";
import { removeNullables } from "../utils";
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
      idsOrTypes: MaybeArray<Na3DepartmentId | Na3DepartmentType>
    ) => Na3Department[];
    getByPositionIds: (
      positionIds: MaybeArray<Na3PositionId>
    ) => Na3Department[];
    getByType: <T extends Na3DepartmentType>(
      type: T
    ) => Array<Na3Department<T>> | undefined;
    getDepartmentMachineById: (
      dptId: LiteralUnion<Na3DepartmentId<"shop-floor">, string>,
      machineId: string
    ) => Na3Machine | undefined;
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
    <T extends Na3DepartmentType>(
      type: T
    ): Array<Na3Department<T>> | undefined =>
      departments.data?.filter(
        (dpt): dpt is Na3Department<T> => dpt.type === type
      ),
    [departments.data]
  );

  const getByIdsOrTypes = useCallback(
    (
      idsOrTypes: MaybeArray<Na3DepartmentId | Na3DepartmentType>
    ): Na3Department[] => {
      const queryArr = isArray(idsOrTypes) ? idsOrTypes : [idsOrTypes];

      return (departments.data || []).filter(
        (dpt) => queryArr.includes(dpt.type) || queryArr.includes(dpt.id)
      );
    },
    [departments.data]
  );

  const getByPositionIds = useCallback(
    (positionIds: MaybeArray<Na3PositionId>): Na3Department[] => {
      const positionIdsArr = isArray(positionIds) ? positionIds : [positionIds];

      return removeNullables(
        positionIdsArr.map((posId) => {
          const [dptId] = posId.split(".");
          return getById(dptId);
        })
      );
    },
    [getById]
  );

  const getDepartmentMachineById = useCallback(
    (
      dptId: LiteralUnion<Na3DepartmentId<"shop-floor">, string>,
      machineId: string
    ): Na3Machine | undefined => {
      const dpt = getById(dptId);
      return dpt?.machines
        ? Object.entries(dpt.machines).find(([id]) => id === machineId)?.[1]
        : undefined;
    },
    [getById]
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
      getByPositionIds,
      isDptType,
      getDepartmentMachineById,
    },
  };
}
