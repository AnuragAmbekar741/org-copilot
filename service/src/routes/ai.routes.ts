import { Router } from "express";
import { previewScenarioController } from "../controllers/ai.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/scenarios/preview", authenticate, previewScenarioController);

export default router;
