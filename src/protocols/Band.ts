import { Musician } from "./Musician";
export type Band = {
  id: number;
  founder: Musician;
  name: string;
  dateOfFoundation: Date;
  city: string;
  style: string;
  members: Musician[];
};

export type BandInput = Omit<Band, "id" | "founder" | "members">;
