import type {
  Na3UserAchievement,
  Na3UserAchievementId,
} from "@modules/na3-types";

export const NA3_USER_ACHIEVEMENTS: {
  [Id in Na3UserAchievementId]: Na3UserAchievement<Id>;
} = {
  service_orders_closed: {
    color: "blue",
    title: "OS encerradas",
    description:
      "Encerre ordens de serviço com menos de 4 horas da solução transmitida",
    icon: "gi-check-mark",
    id: "service_orders_closed",
    levels: [
      { goal: 10, points: 1000 },
      { goal: 25, points: 2500 },
      { goal: 100, points: 10000 },
    ],
    targetDepartments: ["shop-floor", "manutencao"],
    levelDescriptor:
      "Encerre mais {{remaining}} ordens de serviço para alcançar este nível",
  },
  service_orders_solved: {
    color: "green",
    title: "OS solucionadas",
    description: "Solucione ordens de serviço com menos de 4 horas da abertura",
    icon: "gi-auto-repair",
    id: "service_orders_solved",
    levels: [
      { goal: 10, points: 1000 },
      { goal: 50, points: 2500 },
      { goal: 200, points: 10000 },
      { goal: 500, points: 25000 },
    ],
    targetDepartments: ["manutencao"],
    levelDescriptor:
      "Solucione mais {{remaining}} ordens de serviço para alcançar este nível",
  },
};
