import { z } from "zod";

export enum EDepartmentType {
  FactoryAdm = "factory-adm",
  Office = "office",
  ShopFloor = "shop-floor",
}

export const DepartmentTypeSchema = z.nativeEnum(EDepartmentType);
export type DepartmentType = z.infer<typeof DepartmentTypeSchema>;

export enum EDepartmentId {
  Administrativo = "administrativo",
  Comex = "comex",
  Corte = "corte",
  CorteSoldaLuva = "corte-solda-luva",
  CorteSoldaSaco = "corte-solda-saco",
  Desenvolvimento = "desenvolvimento",
  Diretoria = "diretoria",
  Dobra = "dobra",
  Ekoplasto = "ekoplasto",
  Extrusao = "extrusao",
  FlexografiaPapel = "flexografia-papel",
  FlexografiaPlastico = "flexografia-plastico",
  KitAutomatico = "kit-automatico",
  KitManual = "kit-manual",
  Manutencao = "manutencao",
  OffSet = "off-set",
  PCP = "pcp",
  Qualidade = "qualidade",
  Reciclagem = "reciclagem",
  SuperKit = "super-kit",
}

export const DepartmentIdSchema = z.nativeEnum(EDepartmentId);
export type DepartmentId = z.infer<typeof DepartmentIdSchema>;

export enum EDepartmentLocation {
  Factory = "factory",
  Office = "office",
}

export const DepartmentLocationSchema = z.nativeEnum(EDepartmentLocation);
export type DepartmentLocation = z.infer<typeof DepartmentLocationSchema>;

export const DepartmentStyleSchema = z.object({
  colors: z.object({
    background: z.string(),
    text: z.string(),
    web: z.enum([
      "blue",
      "cyan",
      "geekblue",
      "gold",
      "green",
      "lime",
      "magenta",
      "orange",
      "purple",
      "red",
      "volcano",
      "yellow",
    ]),
  }),
});

export type DepartmentStyle = z.infer<typeof DepartmentStyleSchema>;

export const BaseDepartmentSchema = z.object({
  id: DepartmentIdSchema,
  type: DepartmentTypeSchema,
  name: z.string(),
  displayName: z.string(),
  location: DepartmentLocationSchema,
  style: DepartmentStyleSchema,
});

export type BaseDepartment = z.infer<typeof BaseDepartmentSchema>;

export const ShopFloorDepartmentSchema = BaseDepartmentSchema.extend({
  twoLetterId: z.string().length(2),
});

export type ShopFloorDepartment = z.infer<typeof ShopFloorDepartmentSchema>;

export const DepartmentSchema = BaseDepartmentSchema.or(
  ShopFloorDepartmentSchema
);

export type Department = z.infer<typeof DepartmentSchema>;
