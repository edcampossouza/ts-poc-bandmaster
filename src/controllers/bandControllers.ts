import { Request, Response, NextFunction } from "express";
import { BandInput } from "../protocols/Band";
import bandServices from "../services/bandServices.js";

async function createBand(req: Request, res: Response, next: NextFunction) {
  try {
    const bandInput = req.body as BandInput;
    const id: Number = res.locals.user.id;

    await bandServices.create(bandInput, id);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default {
  createBand,
};
