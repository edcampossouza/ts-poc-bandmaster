import {
  Musician,
  MusicianCredentials,
  MusicianInput,
} from "../protocols/Musician";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import musicianRepositories from "../repositories/musicianRepositories.js";
import errors from "../errors/index.js";
import { MusicianQuery } from "../protocols/Queries";

dotenv.config();
const { JWT_SECRET } = process.env;

async function signup(musician: MusicianInput) {
  const exists = await musicianRepositories.findByEmail(musician.email);
  if (exists) throw errors.conflictError("Email already in use");

  const hashedPassword = bcrypt.hashSync(musician.password, 10);
  musician.password = hashedPassword;
  await musicianRepositories.signup(musician);
}

async function signin(musician: MusicianCredentials) {
  const exists = await musicianRepositories.findByEmail(musician.email);
  if (!exists) throw errors.invalidCredentialsError();
  const hashedPassword = exists.password;
  console.log(exists);
  const valid = bcrypt.compareSync(musician.password, hashedPassword);
  if (!valid) throw errors.invalidCredentialsError();
  delete exists.password;
  const token = jwt.sign(exists, JWT_SECRET);
  return { token };
}

async function getById(id: number): Promise<Musician | null> {
  const musician = await musicianRepositories.getById(id);
  if (musician) delete musician.password;
  return musician;
}

async function query(musicianQuery: MusicianQuery): Promise<Musician[]> {
  const musicians: Musician[] =
    await musicianRepositories.getMusiciansFromQuery(musicianQuery);

  return musicians;
}

export default {
  signup,
  signin,
  getById,
  query,
};
