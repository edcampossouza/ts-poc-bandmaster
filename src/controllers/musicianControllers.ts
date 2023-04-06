import { Request, Response, NextFunction } from "express";
import { MusicianCredentials, MusicianInput } from "../protocols/Musician.js";

import musicianServices from "../services/musicianServices.js";
import errors from "../errors/index.js";

async function signup(req: Request, res: Response, next: NextFunction) {
  const musician = req.body as MusicianInput;
  try {
    await musicianServices.signup(musician);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function signin(req: Request, res: Response, next: NextFunction) {
  const credentials = req.body as MusicianCredentials;
  try {
    const token = await musicianServices.signin(credentials);
    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  try {
    const musician = await musicianServices.getById(id);
    if (musician) return res.status(200).send(musician);
    throw errors.notFoundError("Id not found");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default {
  signup,
  signin,
  getById,
};