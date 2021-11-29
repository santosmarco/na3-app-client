import type {
  AutoCompleteOptionBase,
  SelectOptionBase,
  SelectOptionGroup,
} from "@components";
import { Tag } from "@components";
import type { AppUser } from "@modules/na3-react";
import type { Na3Department, Na3DepartmentId } from "@modules/na3-types";
import React from "react";
import type { ConditionalPick } from "type-fest";
import type { Falsy } from "utility-types";

type OptionsGeneratorExtractor<Data, FnReturn> =
  | Extract<keyof ConditionalPick<Data, FnReturn>, string>
  | ((item: Data) => FnReturn);

export function generateSelectOptions<T extends Record<string, unknown>>(
  data: Array<T> | Falsy,
  valueExtractor: OptionsGeneratorExtractor<T, string>,
  labelExtractor?: OptionsGeneratorExtractor<T, React.ReactNode>,
  labelWhenSelectedExtractor?: OptionsGeneratorExtractor<T, React.ReactNode>
): (AutoCompleteOptionBase & SelectOptionBase)[] {
  if (!data) return [];

  return data.map((item) => {
    const value =
      typeof valueExtractor === "string"
        ? (item[valueExtractor] as string)
        : valueExtractor(item);
    const label =
      typeof labelExtractor === "string"
        ? (item[labelExtractor] as React.ReactNode)
        : labelExtractor?.(item);
    const labelWhenSelected =
      typeof labelWhenSelectedExtractor === "string"
        ? (item[labelWhenSelectedExtractor] as React.ReactNode)
        : labelWhenSelectedExtractor?.(item);

    return {
      label: label || value,
      labelWhenSelected,
      value,
    };
  });
}

export function getMaintEmployeeSelectOptions(
  maintenanceUsers: AppUser[]
): SelectOptionBase[] {
  return [...maintenanceUsers]
    .sort((a, b) => a.compactDisplayName.localeCompare(b.compactDisplayName))
    .map((maintainer) => ({
      label: maintainer.compactDisplayName,
      labelWhenSelected: (
        <Tag color={maintainer.style.webColor}>
          {maintainer.compactDisplayName}
        </Tag>
      ),
      value: maintainer.uid,
    }));
}

export function getPrioritySelectOptions(): SelectOptionBase[] {
  return [
    {
      label: "Alta",
      labelWhenSelected: <Tag color="success">ALTA</Tag>,
      value: "high",
    },
    {
      label: "Média",
      labelWhenSelected: <Tag color="warning">Média</Tag>,
      value: "medium",
    },
    {
      label: "Baixa",
      labelWhenSelected: <Tag color="error">BAIXA</Tag>,
      value: "low",
    },
  ];
}

export function getDepartmentSelectOptions(
  departments: Na3Department[]
): SelectOptionGroup<Na3DepartmentId>[] {
  const optionGroups: (Pick<SelectOptionGroup<Na3DepartmentId>, "options"> & {
    label: "Fábrica" | "Filial" | "Setores";
  })[] = [];

  departments.forEach((dpt) => {
    const dptTypeName =
      dpt.type === "shop-floor"
        ? "Setores"
        : dpt.type === "factory-adm"
        ? "Fábrica"
        : "Filial";
    const group = optionGroups.find((g) => g.label === dptTypeName);
    const option = { label: dpt.displayName.toUpperCase(), value: dpt.id };

    if (group) {
      group.options.push(option);
    } else {
      optionGroups.push({ label: dptTypeName, options: [option] });
    }
  });

  const groupLabelMap = { Filial: 3, Fábrica: 2, Setores: 1 };

  return [...optionGroups].sort(
    (a, b) => groupLabelMap[a.label] - groupLabelMap[b.label]
  );
}
