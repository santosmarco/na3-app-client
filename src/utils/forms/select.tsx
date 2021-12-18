import type {
  AutoCompleteOptionBase,
  SelectOptionBase,
  SelectOptionGroup,
} from "@components";
import { DocsStdTypeTag, PriorityTag, Tag } from "@components";
import type { AppUser } from "@modules/na3-react";
import type {
  Na3Department,
  Na3DepartmentId,
  Na3StdDocumentTypeId,
} from "@modules/na3-types";
import { NA3_STD_DOCUMENT_TYPES } from "@modules/na3-types";
import React from "react";
import type { ConditionalPick } from "type-fest";
import type { Falsy } from "utility-types";

import type { PriorityValue } from "../priority";
import { getPriorityValuesConfig } from "../priority";

type OptionsGeneratorExtractor<Data, FnReturn> =
  | Extract<keyof ConditionalPick<Data, FnReturn>, string>
  | ((item: Data) => FnReturn);

export function generateSelectOptions<T extends Record<string, unknown>>(
  data: Falsy | T[],
  valueExtractor: OptionsGeneratorExtractor<T, string>,
  labelExtractor?: OptionsGeneratorExtractor<T, React.ReactNode>,
  labelWhenSelectedExtractor?: OptionsGeneratorExtractor<T, React.ReactNode>
): Array<AutoCompleteOptionBase & SelectOptionBase> {
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

export function getDepartmentSelectOptions(
  departments: Na3Department[]
): Array<SelectOptionGroup<Na3DepartmentId>> {
  const optionGroups: Array<
    Pick<SelectOptionGroup<Na3DepartmentId>, "options"> & {
      label: "Fábrica" | "Filial" | "Setores";
    }
  > = [];

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

export function getPrioritySelectOptions(): Array<
  SelectOptionBase<PriorityValue>
> {
  return getPriorityValuesConfig({ sorted: true }).map((config) => ({
    label: <PriorityTag priority={config.value} type="dot" />,
    labelWhenSelected: <PriorityTag mode="select" priority={config.value} />,
    value: config.value,
  }));
}

export function getMaintEmployeeSelectOptions(
  maintenanceUsers: AppUser[]
): SelectOptionBase[] {
  return [...maintenanceUsers]
    .sort((a, b) => a.compactDisplayName.localeCompare(b.compactDisplayName))
    .map((maintainer) => ({
      label: maintainer.compactDisplayName,
      labelWhenSelected: (
        <Tag color={maintainer.style.webColor} mode="select">
          {maintainer.compactDisplayName}
        </Tag>
      ),
      value: maintainer.uid,
    }));
}

export function getStdDocTypeSelectOptions(): Array<
  SelectOptionBase<Na3StdDocumentTypeId>
> {
  return Object.values(NA3_STD_DOCUMENT_TYPES)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((docType) => ({
      label: <DocsStdTypeTag type={docType} variant="dot" />,
      labelWhenSelected: <DocsStdTypeTag mode="select" type={docType} />,
      value: docType.id,
    }));
}
