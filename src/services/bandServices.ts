import { Musician } from "../protocols/Musician";
import { Band, BandInput } from "../protocols/Band";
import bandRepositories from "../repositories/bandRepositories.js";
import errors from "../errors/index.js";

async function create(bandInput: BandInput, founderId: Number) {
  const bands: Band[] = await bandRepositories.getByName(bandInput.name, {
    exact: true,
  });
  if (bands.length > 0)
    throw errors.conflictError("A band with that name already exists");
  await bandRepositories.create(bandInput, founderId);
}

export default {
  create,
};
