import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createScenario,
  getAllScenariosByUserId,
  getScenarioById,
  updateScenario,
  deleteScenario,
} from "../services/scenario.service";
import { CreateScenarioDto, UpdateScenarioDto } from "../types/scenario";

export const createScenarioController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const data: CreateScenarioDto = req.body;

    if (!data.title) {
      res.status(400).json({ success: false, error: "Title is required" });
      return;
    }

    const scenario = await createScenario(userId, data);
    res.status(201).json({ success: true, data: scenario });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create scenario",
    });
  }
};

export const getScenariosController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const scenarios = await getAllScenariosByUserId(userId);
    res.json({ success: true, data: scenarios });
  } catch {
    res.status(500).json({ success: false, error: "Failed to get scenarios" });
  }
};

export const getScenarioByIdController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    if (!id) {
      res
        .status(400)
        .json({ success: false, error: "Scenario ID is required" });
      return;
    }

    const scenario = await getScenarioById(id, userId);
    if (!scenario) {
      res.status(404).json({ success: false, error: "Scenario not found" });
      return;
    }

    res.json({ success: true, data: scenario });
  } catch {
    res.status(500).json({ success: false, error: "Failed to get scenario" });
  }
};

export const updateScenarioController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const data: UpdateScenarioDto = req.body;

    if (!id) {
      res
        .status(400)
        .json({ success: false, error: "Scenario ID is required" });
      return;
    }

    const updated = await updateScenario(id, userId, data);
    if (!updated) {
      res.status(404).json({ success: false, error: "Scenario not found" });
      return;
    }

    res.json({ success: true, data: updated });
  } catch {
    res
      .status(400)
      .json({ success: false, error: "Failed to update scenario" });
  }
};

export const deleteScenarioController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    if (!id) {
      res
        .status(400)
        .json({ success: false, error: "Scenario ID is required" });
      return;
    }

    const deleted = await deleteScenario(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, error: "Scenario not found" });
      return;
    }

    res.json({ success: true, message: "Scenario deleted successfully" });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete scenario" });
  }
};
