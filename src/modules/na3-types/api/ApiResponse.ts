import type { Na3ApiCompany } from "./ApiCompany";
import type { Na3ApiDepartment } from "./ApiDepartment";
import type { Na3ApiDocument } from "./ApiDocument";
import type { Na3ApiError } from "./ApiError";
import type { Na3ApiPerson } from "./ApiPerson";
import type { Na3ApiProduct } from "./ApiProduct";
import type { Na3ApiStatus } from "./ApiStatus";

export type Na3ApiData =
  | Na3ApiCompany
  | Na3ApiCompany[]
  | Na3ApiDepartment
  | Na3ApiDepartment[]
  | Na3ApiDocument
  | Na3ApiDocument[]
  | Na3ApiPerson
  | Na3ApiProduct
  | Na3ApiStatus;

export type Na3ApiResponseSuccess<Data extends Na3ApiData> = {
  data: Data;
  error: null;
};

export type Na3ApiResponseFail = { data: null; error: Na3ApiError };

export type Na3ApiResponse<Data extends Na3ApiData> =
  | Na3ApiResponseFail
  | Na3ApiResponseSuccess<Data>;

export type Na3ApiResponseArray<Data extends Na3ApiData> = {
  data: Array<Data | null>;
  errors: Array<Na3ApiError | null>;
};

/*
type MakeNa3ApiResponseConfig<Data extends Na3ApiData = Na3ApiData> =
  | { data: Data; type: "success" }
  | { error: unknown; type: "fail" };

export type MakeNa3ApiResponse = <Data extends Na3ApiData>(
  config: MakeNa3ApiResponseConfig<Data>
) => Na3ApiResponse<Data>;
*/
