import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createFinancialItem,
  createFinancialItemsBulk,
  getFinancialItemsByScenario,
  getFinancialItemById,
  deleteFinancialItem,
  updateFinancialItem,
} from "../services/financial-tem.service";
import { CreateFinancialItemDto } from "../types/financial-item";

export const createFinancialItemController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const scenarioId = req.params.scenarioId;
    const data: CreateFinancialItemDto = req.body;

    if (!scenarioId) {
      res.status(400).json({
        success: false,
        error: "Scenario ID is required",
      });
      return;
    }

    if (
      !data.title ||
      !data.category ||
      !data.type ||
      !data.value ||
      !data.frequency ||
      !data.startsAt
    ) {
      res.status(400).json({
        success: false,
        error:
          "Title, category, type, value, frequency, and startsAt are required",
      });
      return;
    }

    const result = await createFinancialItem(userId, scenarioId, data);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create financial item",
    });
  }
};

export const createFinancialItemsBulkController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const scenarioId = req.params.scenarioId;
    const { items }: { items: CreateFinancialItemDto[] } = req.body;

    if (!scenarioId) {
      res.status(400).json({
        success: false,
        error: "Scenario ID is required",
      });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        error: "Items array is required and must not be empty",
      });
      return;
    }

    const result = await createFinancialItemsBulk(userId, scenarioId, items);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create financial items",
    });
  }
};

export const getFinancialItemsByScenarioController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const scenarioId = req.params.scenarioId;

    if (!scenarioId) {
      res.status(400).json({
        success: false,
        error: "Scenario ID is required",
      });
      return;
    }

    const result = await getFinancialItemsByScenario(userId, scenarioId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get financial items",
    });
  }
};

export const getFinancialItemByIdController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Financial item ID is required",
      });
      return;
    }

    const result = await getFinancialItemById(userId, id);

    if (!result) {
      res.status(404).json({
        success: false,
        error: "Financial item not found",
      });
      return;
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get financial item",
    });
  }
};

export const deleteFinancialItemController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Financial item ID is required",
      });
      return;
    }

    const deleted = await deleteFinancialItem(userId, id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: "Financial item not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Financial item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete financial item",
    });
  }
};

export const updateFinancialItemController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { scenarioId, id } = req.params;
    const data = req.body;

    if (!scenarioId || !id) {
      res.status(400).json({
        success: false,
        error: "Scenario ID and Item ID are required",
      });
      return;
    }

    const updated = await updateFinancialItem(id, scenarioId, data);

    if (!updated) {
      res.status(404).json({
        success: false,
        error: "Financial item not found",
      });
      return;
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update financial item",
    });
  }
};
