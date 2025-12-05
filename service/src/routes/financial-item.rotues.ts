import { Router } from "express";
import {
  createFinancialItemController,
  createFinancialItemsBulkController,
  getFinancialItemsByScenarioController,
  getFinancialItemByIdController,
  deleteFinancialItemController,
} from "../controllers/financial-item.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/scenarios/:scenarioId/financial-items",
  authenticate,
  createFinancialItemController
);
router.post(
  "/scenarios/:scenarioId/financial-items/bulk",
  authenticate,
  createFinancialItemsBulkController
);
router.get(
  "/scenarios/:scenarioId/financial-items",
  authenticate,
  getFinancialItemsByScenarioController
);
router.get(
  "/financial-items/:id",
  authenticate,
  getFinancialItemByIdController
);
router.delete(
  "/financial-items/:id",
  authenticate,
  deleteFinancialItemController
);

export default router;
