import { Request, Response, NextFunction } from "express";

export function validateSchemaMiddleware(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const validation = schema.validate(req.body);

    console.log(validation)
    
    if (validation.error) {
      return res.sendStatus(422);
    }
    
    next();
  };
}
