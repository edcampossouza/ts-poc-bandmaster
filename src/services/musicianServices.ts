import { MusicianInput } from "../protocols/Musician";

import bcrypt from "bcrypt";

import musicianRepositories from "../repositories/musicianRepositories.js";
import errors from "../errors/index.js";

async function signup(musician: MusicianInput) {
  const exists = await musicianRepositories.findByEmail(musician.email);
  if (exists) throw errors.conflictError("Email already in use");

  const hashedPassword = bcrypt.hashSync(musician.password, 10);
  musician.password = hashedPassword;
  await musicianRepositories.signup(musician);
}

export default {
  signup,
};
