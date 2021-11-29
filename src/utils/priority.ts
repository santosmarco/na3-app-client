type PriorityValue = "high" | "low" | "medium";

type PriorityValueConfig = {
  color: "error" | "success" | "warning";
  text: string;
  value: PriorityValue;
};

export function getPriorityValuesConfig(options?: {
  sorted?: false | undefined;
}): Record<PriorityValue, PriorityValueConfig>;
export function getPriorityValuesConfig(options: {
  sorted: true;
}): PriorityValueConfig[];
export function getPriorityValuesConfig(options?: {
  sorted?: boolean;
}): PriorityValueConfig[] | Record<PriorityValue, PriorityValueConfig> {
  const config: Record<PriorityValue, PriorityValueConfig> = {
    high: { color: "error", text: "Alta", value: "high" },
    low: { color: "success", text: "Baixa", value: "low" },
    medium: { color: "warning", text: "Média", value: "medium" },
  };

  if (options?.sorted) {
    return [config.high, config.medium, config.low];
  }
  return config;
}
