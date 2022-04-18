import { Router } from "express";
import * as controller from "../controllers/controller.js";
import validateApiKeyMiddleware from "../middlewares/validateApiKeyMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import activateCardSchema from "../schemas/activateCardSchema.js";
import cardSchema from "../schemas/cardSchema.js";
import purchaseSchema from "../schemas/purchaseSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

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
);

router.get("/cards/:id/balance", controller.getBalance);

router.post(
  "/cards/:id/recharge",
  validateSchemaMiddleware(rechargeSchema),
  controller.rechargeCard
);

router.post(
  "/purchases/cards/:id",
  validateSchemaMiddleware(purchaseSchema),
  controller.makePurchase
);

export default router;
