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
