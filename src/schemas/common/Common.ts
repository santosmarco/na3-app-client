import { z } from "zod";

export enum EMeasurementUnit {
  Micrometer = "µm",
  Millimeter = "mm",
}

export const MeasurementUnitSchema = z.nativeEnum(EMeasurementUnit);
export type MeasurementUnit = z.infer<typeof MeasurementUnitSchema>;
