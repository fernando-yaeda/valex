import { Request, Response, NextFunction } from "express";
import * as service from "../services/service.js";

export default async function validateApiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.headers["x-api-key"];

  const company = await service.validateKey(key.toString());

  res.locals.company = company;

  next();
}
