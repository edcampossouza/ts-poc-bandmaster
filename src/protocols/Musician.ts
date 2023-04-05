export type Musician = {
  id: number;
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  skills: string[];
};
export type MusicianInput = Omit<Musician, "id">;
