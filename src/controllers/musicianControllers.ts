import { Request, Response, NextFunction } from "express";
import { MusicianInput } from "../protocols/Musician.js";

import musicianServices from "../services/musicianServices.js";

async function signup(req: Request, res: Response, next: NextFunction) {
  const inputObject = req.body as MusicianInput;
  try {
    await musicianServices.signup(inputObject);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default {
  signup,
};
