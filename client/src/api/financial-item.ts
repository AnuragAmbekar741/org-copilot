import { post, del, put } from "@/utils/request";
import { type FinancialItem } from "./scenario";

export type CreateFinancialItemPayload = {
  title: string;
  category: string;
  type: "cost" | "revenue";
  value: number;
  frequency: "monthly" | "one_time" | "yearly";
  startsAt: number;
  endsAt?: number | null;
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

export const updateFinancialItemApi = async (
  scenarioId: string,
  itemId: string,
  payload: Partial<CreateFinancialItemPayload>
) => {
  const data = await put<
    FinancialItemResponse,
    Partial<CreateFinancialItemPayload>
  >(`/scenarios/${scenarioId}/financial-items/${itemId}`, payload);
  return data;
};

export const deleteFinancialItemApi = async (itemId: string) => {
  const data = await del<{ success: boolean; message?: string }>(
    `/financial-items/${itemId}`
  );
  return data;
};
