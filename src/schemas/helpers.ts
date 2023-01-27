import { z } from "zod";

export function makeStrToNumSchema(
  numSchema?: z.ZodNumber
): z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber> {
  return z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .transform((val) => Number.parseFloat(val.replace(",", ".")))
    .pipe(numSchema ?? z.number());
}
