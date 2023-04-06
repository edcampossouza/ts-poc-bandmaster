import { Musician } from "../protocols/Musician";
import { Band, BandInput } from "../protocols/Band";
import bandRepositories from "../repositories/bandRepositories.js";
import errors from "../errors/index.js";
import { BandQuery } from "../protocols/Queries";
import musicianRepositories from "../repositories/musicianRepositories.js";

async function create(bandInput: BandInput, founderId: Number) {
  const bands: Band[] = await bandRepositories.getByName(bandInput.name, {
    exact: true,
  });
  if (bands.length > 0)
    throw errors.conflictError("A band with that name already exists");
  await bandRepositories.create(bandInput, founderId);
}

async function query(bandQuery: BandQuery): Promise<Band[]> {
  const bands: Band[] = await bandRepositories.getBandsFromQuery(bandQuery);

  return bands;
}

async function invite({ userID, bandId, musicianId }): Promise<void> {
  const bands = await bandRepositories.getBandsFromQuery({ id: bandId });
  if (bands.length < 1) throw errors.notFoundError(`Invalid band id`);
  const theBand = bands[0];
  if (theBand.founder.id !== userID) {
    throw errors.invalidCredentialsError(
      `Only ${theBand.founder.name} can invite people to ${theBand.name}!`
    );
  }
  const theMusician = await musicianRepositories.getById(musicianId);
  if (!theMusician) throw errors.notFoundError(`Invalid musician id`);
  if (theBand.members.map((m) => m.id).includes(musicianId))
    throw errors.conflictError(
      `${theMusician.name} is already in ${theBand.name}`
    );

  const pendingInvitations = await musicianRepositories.getPendingInvitations(
    musicianId
  );
  const invited = pendingInvitations.find((b) => b.id === bandId);
  if (invited) {
    throw errors.conflictError(
      `${theMusician.name} has already been invited to ${theBand.name} at ${invited.invited_at}`
    );
  }
  await bandRepositories.invite({ bandId, musicianId });
}

export default {
  create,
  query,
  invite,
};
