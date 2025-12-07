import { get, post } from "@/utils/request";

export interface FinancialItem {
  id?: string;
  title: string;
  category: string;
  type: "cost" | "revenue";
  value: number;
  frequency: "monthly" | "one_time" | "yearly";
  startsAt: string;
  endsAt?: string;
}

export type CreateScenarioPayload = {
  title: string;
  description?: string;
  financialItems?: FinancialItem[];
};

export type Scenario = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  financialItems?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

export type ScenarioResponse = {
  success: boolean;
  data: Scenario;
};

export type ScenariosResponse = {
  success: boolean;
  data: Scenario[];
};

export type ScenarioByIdResponse = {
  success: boolean;
  data: Scenario;
};

export const createScenarioApi = async (payload: CreateScenarioPayload) => {
  const data = await post<ScenarioResponse, CreateScenarioPayload>(
    "/scenarios",
    payload
  );
  return data;
};

export const getScenariosApi = async () => {
  const data = await get<ScenariosResponse>("/scenarios");
  return data;
};

export const getScenarioByIdApi = async (id: string) => {
  const data = await get<ScenarioByIdResponse>(`/scenarios/${id}`);
  return data;
};
