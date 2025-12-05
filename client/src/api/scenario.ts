import { post } from "@/utils/request";

export type CreateScenarioPayload = {
  title: string;
  description?: string;
  financialItems?: Array<{
    title: string;
    category: string;
    type: "cost" | "revenue";
    value: number;
    frequency: "monthly" | "one_time" | "yearly";
    startsAt: string;
    endsAt?: string;
  }>;
};

export type ScenarioResponse = {
  success: boolean;
  data: {
    id: string;
    userId: string;
    title: string;
    description?: string;
    financialItems?: unknown[];
    createdAt?: string;
    updatedAt?: string;
  };
};

export const createScenarioApi = async (payload: CreateScenarioPayload) => {
  const data = await post<ScenarioResponse, CreateScenarioPayload>(
    "/scenarios",
    payload
  );
  return data;
};
