import { z } from "zod";

const financialItemSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  type: z.enum(["cost", "revenue"], {
    message: "Type is required",
  }),
  value: z.coerce.number().min(0, { message: "Value must be positive" }),
  frequency: z.enum(["monthly", "one_time", "yearly"], {
    message: "Frequency is required",
  }),
  startsAt: z.string().min(1, { message: "Start date is required" }),
  endsAt: z.string().optional(),
});

export const scenarioSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  financialItems: z.array(financialItemSchema).optional(),
});

export type ScenarioFormValues = z.input<typeof scenarioSchema>;
