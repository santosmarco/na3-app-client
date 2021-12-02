import type {
  Na3DepartmentId,
  Na3PositionId,
  Na3PositionIdBase,
} from "@modules/na3-types";
import { useCallback } from "react";

type UseNa3PositionsResult = {
  parsePositionId: (
    positionId: Na3PositionId
  ) => [Na3DepartmentId, Na3PositionIdBase];
};

export function useNa3Positions(): UseNa3PositionsResult {
  const parsePositionId = useCallback(
    (positionId: Na3PositionId): [Na3DepartmentId, Na3PositionIdBase] => {
      const parsed = positionId.split(".") as [
        Na3DepartmentId,
        Na3PositionIdBase
      ];

      return parsed;
    },
    []
  );

  return { parsePositionId };
}
