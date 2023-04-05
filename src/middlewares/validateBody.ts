import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export default function validateBody(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message: string[] = error.details.map((d) => d.message);
      return res.status(422).send({ error: message });
    } else {
      next();
    }
  };
}
