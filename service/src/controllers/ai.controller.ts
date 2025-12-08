import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateScenarioFromPrompt } from "../services/ai.service";
import { createScenario } from "../services/scenario.service";

export const previewScenarioController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({
        success: false,
        error: "Prompt is required and must be a string",
      });
      return;
    }

    // Generate scenario from prompt using AI (without saving)
    const scenarioData = await generateScenarioFromPrompt(prompt);

    res.json({
      success: true,
      data: scenarioData,
    });
  } catch (error) {
    console.error("Error in previewScenarioController:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to preview scenario from prompt",
    });
  }
};
