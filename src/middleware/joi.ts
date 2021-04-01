import { Response, Request, NextFunction } from "express";
import Joi, { AnySchema } from "joi";

export function validateSchema(
  schema: AnySchema,
  validate: "body" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req[validate]);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    } else {
      req[validate] = result.value;
    }
    next();
  };
}
