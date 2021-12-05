export type Na3MachineProdUnit = "kg" | "mil";

type Na3MachineBase = {
  id: string;
  issues: string[];
  name: string;
  number: number;
};

type Na3MachineProductive = Na3MachineBase & {
  hourlyProdRate: number;
  prodUnit: Na3MachineProdUnit;
};

type Na3MachineNonProductive = Na3MachineBase & {
  hourlyProdRate: null;
  prodUnit: null;
};

export type Na3Machine = Na3MachineNonProductive | Na3MachineProductive;
