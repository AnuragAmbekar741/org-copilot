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
  startsAt: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Starts at must be >= 0 (timeline index)" }),
  endsAt: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : val),
      z.coerce.number().int().nonnegative()
    )
    .optional(),
});

export const scenarioSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  timelineLength: z.coerce
    .number()
    .int()
    .positive({ message: "Timeline length must be > 0" }),
  financialItems: z.array(financialItemSchema).optional(),
});

export type ScenarioFormValues = z.input<typeof scenarioSchema>;
