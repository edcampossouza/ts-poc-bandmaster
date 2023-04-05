import { MusicianInput } from "../protocols/Musician";

async function signup(musician: MusicianInput) {
  console.log(musician);
}

export default {
  signup,
};
