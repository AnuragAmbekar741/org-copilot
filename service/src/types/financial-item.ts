export type FinancialItemType = "cost" | "revenue";
export type FinancialItemFrequency = "monthly" | "one_time" | "yearly";

export interface CreateFinancialItemDto {
  title: string;
  category: string;
  type: FinancialItemType;
  value: number;
  frequency: FinancialItemFrequency;
  startsAt: string;
  endsAt?: string;
}

export interface FinancialItemDto extends CreateFinancialItemDto {
  id: string;
  scenarioId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
