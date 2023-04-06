import { Request, Response, NextFunction } from "express";
import { BandInput } from "../protocols/Band";
import bandServices from "../services/bandServices.js";
import { BandQuery } from "../protocols/Queries";

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

async function searchBands(req: Request, res: Response, next: NextFunction) {
  try {
    const queryParams = req.query as BandQuery;
    const results = await bandServices.query(queryParams);
    return res.status(200).send(results);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function invite(req: Request, res: Response, next: NextFunction) {
  try {
    const { bandId, musicianId } = req.params;
    const userID: Number = res.locals.user.id;
    await bandServices.invite({ userID, bandId: Number(bandId), musicianId: Number(musicianId) });

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default {
  createBand,
  searchBands,
  invite,
};
