import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(8, { message: "Min 8 characters" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name too short" }),
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(8, { message: "Min 8 characters" }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
