import { post } from "@/utils/request";
import { type FinancialItem } from "./scenario";

export type CreateFinancialItemPayload = {
  title: string;
  category: string;
  type: "cost" | "revenue";
  value: number;
  frequency: "monthly" | "one_time" | "yearly";
  startsAt: string;
  endsAt?: string;
};

export type FinancialItemResponse = {
  success: boolean;
  data: FinancialItem;
};

export const createFinancialItemApi = async (
  scenarioId: string,
  payload: CreateFinancialItemPayload
) => {
  const data = await post<FinancialItemResponse, CreateFinancialItemPayload>(
    `/scenarios/${scenarioId}/financial-items`,
    payload
  );
  return data;
};
