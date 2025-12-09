import { FinancialItemFrequency, FinancialItemType } from "./financial-item";
import { z } from "zod";

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
  startsAt: z
    .number()
    .int()
    .nonnegative()
    .describe("Month number of the start date"),
  endsAt: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .describe(
      "Month number of the end date if applicable, or null if not applicable"
    ),
});

export const createScenarioSchema = z.object({
  title: z.string().describe("A concise, professional scenario title"),
  description: z
    .string()
    .nullable()
    .describe(
      "A detailed description of the scenario including key financial assumptions, or null if not provided"
    ),
  financialItems: z
    .array(createFinancialItemSchema)
    .nullable()
    .describe(
      "Array of all financial items for the scenario, or null if empty"
    ),
  timelineLength: z
    .number()
    .int()
    .positive()
    .describe(
      "Number of timeline columns to render (e.g., 12 for months, 4 for quarters)"
    ),
});
