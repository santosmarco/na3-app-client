import { z } from "zod";

import { makeStrToNumSchema } from "../helpers";

export enum EProductDepartmentId {
  CorteSolda = "Corte & Solda",
  KitAutomatico = "Kit Automático",
}

export const ProductDepartmentIdSchema = z.nativeEnum(EProductDepartmentId);
export type ProductDepartmentId = z.infer<typeof ProductDepartmentIdSchema>;

export const ProductPackageTypeSchema = z.enum(["Caixa de papelão"]);

export const ProductUnitSchema = z.enum(["MIL", "KG", "CX"]);

export const ProductMinNomMaxSchema = z.object({
  min: makeStrToNumSchema(z.number().gt(0, "Deve ser maior que zero")),
  nom: makeStrToNumSchema(z.number().gt(0, "Deve ser maior que zero")),
  max: makeStrToNumSchema(z.number().gt(0, "Deve ser maior que zero")),
});

export const ProductWidthHeightSchema = z.object({
  width: ProductMinNomMaxSchema,
  height: ProductMinNomMaxSchema,
});

export const ProductKitAutomaticoVariantSchema = z.object({
  subProducts: z.object({
    leaflet: z.object({
      opened: ProductWidthHeightSchema,
      closed: ProductWidthHeightSchema,
      grammage: makeStrToNumSchema(z.number().gt(0, "Deve ser maior que zero")),
      colors: z.tuple([
        z.string().trim().min(1, "Campo obrigatório"),
        z.string().trim().min(1, "Campo obrigatório"),
        z.string().trim().min(1, "Campo obrigatório"),
        z.string().trim().min(1, "Campo obrigatório"),
      ]),
    }),
    glove: z.object({
      internal: ProductWidthHeightSchema.extend({
        thickness: ProductMinNomMaxSchema,
      }),
      external: ProductWidthHeightSchema.extend({
        thickness: ProductMinNomMaxSchema,
      }),
    }),
  }),
});

export const ProductSchema = z.object({
  name: z.string().trim().min(1, "Campo obrigatório"),
  code: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Deve possuir exatamente dez dígitos"),
  description: z.string().trim().min(1, "Campo obrigatório"),
  packageType: ProductPackageTypeSchema,
  qtyPerPackage: makeStrToNumSchema(
    z.number().gt(0, "Deve ser maior que zero")
  ),
  unit: ProductUnitSchema,
  variant: z.discriminatedUnion("kind", [
    ProductKitAutomaticoVariantSchema.extend({
      kind: z.literal(EProductDepartmentId.KitAutomatico),
    }),
  ]),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductSchemaInput = z.input<typeof ProductSchema>;
export type ProductSchemaOutput = z.output<typeof ProductSchema>;
