import { Band, BandInput } from "../protocols/Band.js";
import connectionDb from "../config/database.js";
import { Musician } from "../protocols/Musician.js";

async function getByName(name: string, { exact = false }): Promise<Band[]> {
  const key = exact ? name : `%${name}%`;
  const bands: Band[] = (
    await connectionDb.query(
      `
        SELECT json_build_object (
            'id', band.id,
            'founder', json_build_object(
                'id', founder.id,
                'name', founder.name,
                'dateOfBirth', founder.date_of_birth,
                'email', founder.email,
                'skills', (
                    (select array_agg(musician_skill.skill)
                    from musician_skill
                    where musician_skill.musician_id = founder.id)
                )
            ),
            'name', band.name,
            'dateOfFoundation', band.date_of_foundation,
            'city', band.city,
            'style', band.style
         
        )
        FROM band
        JOIN musician as founder on founder.id = band.founder_id
        WHERE band.name like $1
        GROUP BY band.id, founder.id, band.name
        
    `,
      [key]
    )
  ).rows.map((r) => r.json_build_object);
  for (const band of bands) {
    band.members = await bandMembers(band.id);
  }
  return bands;
}

async function create(bandInput: BandInput, founder_id: Number): Promise<void> {
  const result = await connectionDb.query(
    `
            INSERT INTO band(name, founder_id, date_of_foundation, city, style)
            VALUES ($1, $2, $3, $4, $5) returning id
        `,
    [
      bandInput.name,
      founder_id,
      bandInput.dateOfFoundation,
      bandInput.city,
      bandInput.style,
    ]
  );
  const id = result.rows[0].id;
  await connectionDb.query(
    `
        INSERT INTO musician_band(musician_id, band_id, accepted_at) 
        VALUES ($1, $2, now())
     
    `,
    [founder_id, id]
  );
}

async function bandMembers(bandId: number): Promise<Musician[]> {
  const results = await connectionDb.query(
    `
            SELECT  json_build_object(
                'name', name, 
                'email', email, 
                'date_of_birth', date_of_birth,
                'skills', json_agg(musician_skill.skill)
            )
            
                FROM musician
                JOIN musician_band on musician_band.musician_id = musician.id
                LEFT JOIN musician_skill ON musician_skill.musician_id = musician.id
                WHERE musician_band.band_id = $1
                GROUP BY name, email, date_of_birth
        `,
    [bandId]
  );
  return results.rows;
}

export default {
  getByName,
  create,
};
