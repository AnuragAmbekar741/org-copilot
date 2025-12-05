import { FinancialItemDto, CreateFinancialItemDto } from "./financial-item";

export interface CreateScenarioDto {
  title: string;
  description?: string;
  financialItems?: CreateFinancialItemDto[];
}

export interface ScenarioDto extends CreateScenarioDto {
  id: string;
  userId: string;
  financialItems?: FinancialItemDto[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface UpdateScenarioDto extends Partial<CreateScenarioDto> {}
