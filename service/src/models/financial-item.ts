import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { scenarios } from "./scenario";

export const financialItems = pgTable("financial_items", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // "cost" | "revenue"
  value: numeric("value", { precision: 15, scale: 2 }).notNull(),
  frequency: text("frequency").notNull(), // "monthly" | "one_time" | "yearly"
  startsAt: integer("starts_at").notNull(),
  endsAt: integer("ends_at").default(sql`null`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
