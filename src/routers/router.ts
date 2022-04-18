import { Router } from "express";
import * as controller from "../controllers/controller.js";
import validateApiKeyMiddleware from "../middlewares/validateApiKeyMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import activateCardSchema from "../schemas/activateCardSchema.js";
import cardSchema from "../schemas/cardSchema.js";

const router = Router();

router.post(
  "/cards",
  validateSchemaMiddleware(cardSchema),
  validateApiKeyMiddleware,
  controller.createCard
);

router.post(
    "/cards/:id/activate",
    validateSchemaMiddleware(activateCardSchema),
    controller.activateCard
)

router.get(
    "/cards/:id/balance",
    controller.getBalance
)

export default router;
