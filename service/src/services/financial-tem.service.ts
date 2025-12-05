import { db } from "../config/db.config";
import { financialItems } from "../models/financial-item";
import { scenarios } from "../models/scenario";
import { and, eq } from "drizzle-orm";
import {
  CreateFinancialItemDto,
  FinancialItemDto,
} from "../types/financial-item";

const ensureScenarioOwnership = async (scenarioId: string, userId: string) => {
  const rows = await db
    .select({ id: scenarios.id })
    .from(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)))
    .limit(1);
  return !!rows[0];
};

type FinancialItemRow = typeof financialItems.$inferSelect;

const mapItem = (item: FinancialItemRow): FinancialItemDto => ({
  id: item.id,
  scenarioId: item.scenarioId,
  title: item.title,
  category: item.category,
  type: item.type as "cost" | "revenue",
  value: Number(item.value),
  frequency: item.frequency as "monthly" | "one_time" | "yearly",
  startsAt: item.startsAt.toISOString(),
  endsAt: item.endsAt ? item.endsAt.toISOString() : undefined,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

// Create one
export const createFinancialItem = async (
  userId: string,
  scenarioId: string,
  data: CreateFinancialItemDto
): Promise<FinancialItemDto> => {
  const ok = await ensureScenarioOwnership(scenarioId, userId);
  if (!ok) throw new Error("Scenario not found or access denied");

  const rows = await db
    .insert(financialItems)
    .values({
      scenarioId,
      title: data.title,
      category: data.category,
      type: data.type,
      value: data.value.toString(),
      frequency: data.frequency,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
    })
    .returning();

  return mapItem(rows[0]);
};

// Create bulk
export const createFinancialItemsBulk = async (
  userId: string,
  scenarioId: string,
  items: CreateFinancialItemDto[]
): Promise<FinancialItemDto[]> => {
  if (!items.length) return [];
  const ok = await ensureScenarioOwnership(scenarioId, userId);
  if (!ok) throw new Error("Scenario not found or access denied");

  const rows = await db
    .insert(financialItems)
    .values(
      items.map((item) => ({
        scenarioId,
        title: item.title,
        category: item.category,
        type: item.type,
        value: item.value.toString(),
        frequency: item.frequency,
        startsAt: new Date(item.startsAt),
        endsAt: item.endsAt ? new Date(item.endsAt) : null,
      }))
    )
    .returning();

  return rows.map(mapItem);
};

// Get all by scenario
export const getFinancialItemsByScenario = async (
  userId: string,
  scenarioId: string
): Promise<FinancialItemDto[]> => {
  const ok = await ensureScenarioOwnership(scenarioId, userId);
  if (!ok) return [];

  const rows = await db
    .select()
    .from(financialItems)
    .where(eq(financialItems.scenarioId, scenarioId));

  return rows.map(mapItem);
};

export const getFinancialItemById = async (
  userId: string,
  id: string
): Promise<FinancialItemDto | null> => {
  const rows = await db
    .select({
      id: financialItems.id,
      scenarioId: financialItems.scenarioId,
      title: financialItems.title,
      category: financialItems.category,
      type: financialItems.type,
      value: financialItems.value,
      frequency: financialItems.frequency,
      startsAt: financialItems.startsAt,
      endsAt: financialItems.endsAt,
      createdAt: financialItems.createdAt,
      updatedAt: financialItems.updatedAt,
    })
    .from(financialItems)
    .innerJoin(scenarios, eq(financialItems.scenarioId, scenarios.id))
    .where(and(eq(financialItems.id, id), eq(scenarios.userId, userId)))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return mapItem(rows[0]);
};

export const deleteFinancialItem = async (
  userId: string,
  id: string
): Promise<boolean> => {
  const existing = await getFinancialItemById(userId, id);
  if (!existing) {
    return false;
  }

  const result = await db
    .delete(financialItems)
    .where(eq(financialItems.id, id))
    .returning();

  return result.length > 0;
};
