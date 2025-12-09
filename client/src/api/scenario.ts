import { get, post, del } from "@/utils/request";

export interface FinancialItem {
  id?: string;
  title: string;
  category: string;
  type: "cost" | "revenue";
  value: number;
  frequency: "monthly" | "one_time" | "yearly";
  startsAt: number;
  endsAt?: number | null;
}

export type CreateScenarioPayload = {
  title: string;
  description?: string;
  financialItems?: FinancialItem[];
  timelineLength: number;
};

export type Scenario = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  financialItems?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  timelineLength: number;
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

export type DeleteScenarioResponse = {
  success: boolean;
  message?: string;
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

export const deleteScenarioApi = async (id: string) => {
  const data = await del<DeleteScenarioResponse>(`/scenarios/${id}`);
  return data;
};
