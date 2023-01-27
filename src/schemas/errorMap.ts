import { z } from "zod";

z.setErrorMap((issue, ctx) => {
  let message: string;
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === z.ZodParsedType.undefined) {
        message = "Campo obrigatório";
      } else {
        message = `Tipo do campo inválido: esperava-se ${issue.expected}, obteve ${issue.received}`;
      }
      break;
    case z.ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(
        issue.expected,
        z.util.jsonStringifyReplacer
      )}`;
      break;
    case z.ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${z.util.joinValues(
        issue.keys,
        ", "
      )}`;
      break;
    case z.ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case z.ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${z.util.joinValues(
        issue.options
      )}`;
      break;
    case z.ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${z.util.joinValues(
        issue.options
      )}, received '${issue.received}'`;
      break;
    case z.ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case z.ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case z.ZodIssueCode.invalid_date:
      message = `Data inválida`;
      break;
    case z.ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("startsWith" in issue.validation) {
          message = `Deve iniciar com "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Deve terminar com "${issue.validation.endsWith}"`;
        } else {
          z.util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Validação "${issue.validation}" falhou`;
      } else {
        message = "Campo inválido";
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "array" || issue.type === "set")
        message = `Deve possuir ${
          issue.exact
            ? "exatamente"
            : issue.inclusive
            ? `pelo menos`
            : `mais de`
        } ${issue.minimum} elemento(s)`;
      else if (issue.type === "string")
        message = `Deve possuir ${
          issue.exact
            ? "exatamente"
            : issue.inclusive
            ? `pelo menos`
            : `mais de`
        } ${issue.minimum} caractere(s)`;
      else if (issue.type === "number")
        message = `Deve ser ${
          issue.exact
            ? `exatamente igual a `
            : issue.inclusive
            ? `maior que ou igual a `
            : `maior que `
        }${issue.minimum}`;
      else
        message = `Deve ser ${
          issue.exact
            ? `exatamente igual a `
            : issue.inclusive
            ? `maior que ou igual a `
            : `maior que `
        }${String(new Date(issue.minimum))}`;
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === "array" || issue.type === "set")
        message = `Deve possuir ${
          issue.exact ? `exatamente` : issue.inclusive ? `até` : `menos de`
        } ${issue.maximum} elemento(s)`;
      else if (issue.type === "string")
        message = `Deve possuir ${
          issue.exact ? `exatamente` : issue.inclusive ? `at most` : `under`
        } ${issue.maximum} caractere(s)`;
      else if (issue.type === "number")
        message = `Deve ser ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `less than or equal to`
            : `less than`
        } ${issue.maximum}`;
      else
        message = `Deve ser ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `smaller than or equal to`
            : `smaller than`
        } ${String(new Date(issue.maximum))}`;
      break;
    case z.ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case z.ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case z.ZodIssueCode.not_multiple_of:
      message = `Deve ser um número múltiplo de ${issue.multipleOf}`;
      break;
    case z.ZodIssueCode.not_finite:
      message = "Número deve ser finito";
      break;
    default:
      message = ctx.defaultError;
      z.util.assertNever(issue);
  }
  return { message };
});
