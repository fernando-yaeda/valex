import { Request, Response } from "express";
import * as services from "../services/service.js";

export async function createCard(req: Request, res: Response) {
  try {
    await services.createCard(req.body);

    res.sendStatus(201);
  } catch (error) {
    if (error.type === "error_conflict") {
      return res.status(409).send({ message: error.message });
    }
    if (error.type === "error_not_found") {
      return res.status(404).send({ message: error.message });
    }
    if (error.type === "unauthorized") {
      return res.status(401).send({ message: error.message });
    }

    return res.sendStatus(500);
  }
}

export async function activateCard(req: Request, res: Response) {
  try {
    const cardId = parseInt(req.params.id);
    const cardData = {
        securityCode: req.body.securityCode,
        password: req.body.password
    }

    await services.activateCard(cardId, cardData);

    res.sendStatus(200);
  } catch (error) {
    if (error.type === "error_conflict") {
      return res.status(409).send({ message: error.message });
    }
    if (error.type === "error_not_found") {
      return res.status(404).send({ message: error.message });
    }
    if (error.type === "unauthorized") {
      return res.status(401).send({ message: error.message });
    }

    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getBalance(req: Request, res: Response) {
  const cardId = parseInt(req.params.id);

  try {
    const { balance, payments, recharges } = await services.getBalance(cardId);

    const balanceObject = {
      balance,
      transactions: payments,
      recharges: recharges,
    };

    return res.status(200).send(JSON.stringify(balanceObject));
  } catch (error) {
    if (error.type === "error_conflict") {
      return res.status(409).send({ message: error.message });
    }
    if (error.type === "error_not_found") {
      return res.status(404).send({ message: error.message });
    }
    if (error.type === "unauthorized") {
      return res.status(401).send({ message: error.message });
    }

    console.log(error);
    return res.sendStatus(500);
  }
}

export async function rechargeCard(req: Request, res: Response) {
  const cardId = req.params.id;
  const amount = req.body;

  try {
    await services.rechargeCard(parseInt(cardId), amount);

    res.sendStatus(200);
  } catch (error) {
    if (error.type === "error_conflict") {
      return res.status(409).send({ message: error.message });
    }
    if (error.type === "error_not_found") {
      return res.status(404).send({ message: error.message });
    }
    if (error.type === "unauthorized") {
      return res.status(401).send({ message: error.message });
    }

    console.log(error);
    return res.sendStatus(500);
  }
}

export async function makePurchase(req: Request, res: Response) {
    const purchaseData = {
        cardId: parseInt(req.params.id),
        businessId: req.body.businessId,
        amount: req.body.amount}

    await services.makePurchase(purchaseData)
}
