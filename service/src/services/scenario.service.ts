import { db } from "../config/db.config";
import { scenarios } from "../models/scenario";
import { and, eq } from "drizzle-orm";
import {
  CreateScenarioDto,
  UpdateScenarioDto,
  ScenarioDto,
} from "../types/scenario";
import {
  createFinancialItemsBulk,
  getFinancialItemsByScenario,
} from "./financial-tem.service";
import { FinancialItemDto } from "../types/financial-item";

type ScenarioRow = typeof scenarios.$inferSelect;

const mapScenario = async (
  scenario: ScenarioRow,
  userId: string
): Promise<ScenarioDto> => {
  const financialItems = await getFinancialItemsByScenario(userId, scenario.id);

  return {
    id: scenario.id,
    userId: scenario.userId,
    title: scenario.title,
    description: scenario.description ?? undefined,
    financialItems: financialItems.length > 0 ? financialItems : [],
    timelineLength: scenario.timelineLength,
    createdAt: scenario.createdAt,
    updatedAt: scenario.updatedAt,
  };
};

export const createScenario = async (
  userId: string,
  data: CreateScenarioDto
): Promise<ScenarioDto> => {
  const result = await db
    .insert(scenarios)
    .values({
      userId,
      title: data.title,
      description: data.description ?? null,
      timelineLength: data.timelineLength,
    })
    .returning();

  const scenario = result[0];

  let createdFinancialItems: FinancialItemDto[] = [];

  if (data.financialItems && data.financialItems.length > 0) {
    createdFinancialItems = await createFinancialItemsBulk(
      userId,
      scenario.id,
      data.financialItems
    );
  }

  return {
    id: scenario.id,
    userId: scenario.userId,
    title: scenario.title,
    description: scenario.description ?? undefined,
    financialItems: createdFinancialItems,
    timelineLength: scenario.timelineLength,
    createdAt: scenario.createdAt,
    updatedAt: scenario.updatedAt,
  };
};

export const getAllScenariosByUserId = async (
  userId: string
): Promise<ScenarioDto[]> => {
  const rows = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.userId, userId));

  const scenariosWithItems = await Promise.all(
    rows.map((scenario) => mapScenario(scenario, userId))
  );

  return scenariosWithItems;
};

export const getScenarioById = async (
  id: string,
  userId: string
): Promise<ScenarioDto | null> => {
  const rows = await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.id, id), eq(scenarios.userId, userId)))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return mapScenario(rows[0], userId);
};

export const updateScenario = async (
  id: string,
  userId: string,
  data: UpdateScenarioDto
): Promise<ScenarioDto | null> => {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined)
    updateData.description = data.description ?? null;
  if (data.timelineLength !== undefined)
    updateData.timelineLength = data.timelineLength;
  updateData.updatedAt = new Date();

  const rows = await db
    .update(scenarios)
    .set(updateData)
    .where(and(eq(scenarios.id, id), eq(scenarios.userId, userId)))
    .returning();

  if (rows.length === 0) {
    return null;
  }

  return mapScenario(rows[0], userId);
};

export const deleteScenario = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const result = await db
    .delete(scenarios)
    .where(and(eq(scenarios.id, id), eq(scenarios.userId, userId)))
    .returning();

  return result.length > 0;
};
