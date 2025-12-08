import { z } from "zod";
import { CreateScenarioDto } from "./scenario";
import {
  CreateFinancialItemDto,
  FinancialItemType,
  FinancialItemFrequency,
} from "./financial-item";

// Zod schema for CreateFinancialItemDto
export const createFinancialItemSchema = z.object({
  title: z.string().describe("Clear, descriptive title for the financial item"),
  category: z
    .string()
    .describe(
      "Category: Engineering, Sales, Marketing, Operations, Infrastructure, Revenue, etc."
    ),
  type: z
    .enum(["revenue", "cost"] satisfies [FinancialItemType, FinancialItemType])
    .describe("Type of financial item"),
  value: z.number().describe("Numeric value in dollars"),
  frequency: z
    .enum(["monthly", "one_time", "yearly"] satisfies [
      FinancialItemFrequency,
      FinancialItemFrequency,
      FinancialItemFrequency
    ])
    .describe("Frequency of the item"),
  startsAt: z.string().describe("Start date in YYYY-MM-DD format"),
  endsAt: z
    .string()
    .optional()
    .describe("End date in YYYY-MM-DD format if applicable"),
}) satisfies z.ZodType<CreateFinancialItemDto>;

// Zod schema for CreateScenarioDto
export const createScenarioSchema = z.object({
  title: z.string().describe("A concise, professional scenario title"),
  description: z
    .string()
    .optional()
    .describe(
      "A detailed description of the scenario including key financial assumptions"
    ),
  financialItems: z
    .array(createFinancialItemSchema)
    .optional()
    .describe("Array of all financial items for the scenario"),
}) satisfies z.ZodType<CreateScenarioDto>;
