import { Router } from "express";
import {
  createScenarioController,
  getScenariosController,
  getScenarioByIdController,
  updateScenarioController,
  deleteScenarioController,
} from "../controllers/scenario.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/scenarios", authenticate, createScenarioController);
router.get("/scenarios", authenticate, getScenariosController);
router.get("/scenarios/:id", authenticate, getScenarioByIdController);
router.put("/scenarios/:id", authenticate, updateScenarioController);
router.delete("/scenarios/:id", authenticate, deleteScenarioController);

export default router;
