import { FinancialItemFrequency, FinancialItemType } from "./financial-item";
import { z } from "zod";
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
  // Make endsAt nullable (not optional) - it will always be present but can be null
  endsAt: z
    .string()
    .nullable()
    .describe(
      "End date in YYYY-MM-DD format if applicable, or null if not applicable"
    ),
});

// Zod schema for CreateScenarioDto
export const createScenarioSchema = z.object({
  title: z.string().describe("A concise, professional scenario title"),
  // Make description nullable (not optional)
  description: z
    .string()
    .nullable()
    .describe(
      "A detailed description of the scenario including key financial assumptions, or null if not provided"
    ),
  // Make financialItems nullable (not optional)
  financialItems: z
    .array(createFinancialItemSchema)
    .nullable()
    .describe(
      "Array of all financial items for the scenario, or null if empty"
    ),
});
