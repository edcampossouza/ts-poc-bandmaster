import { Musician, MusicianInput } from "../protocols/Musician";

import connectionDb from "../config/database.js";

async function signup(musician: MusicianInput) {
  const mus = await connectionDb.query(
    `
            INSERT INTO musician (name, email, password, date_of_birth)
            VALUES ($1, $2, $3, $4) returning id;
        `,
    [musician.name, musician.email, musician.password, musician.dateOfBirth]
  );
  const { id } = mus.rows[0];
  for (const skill of musician.skills) {
    await connectionDb.query(
      `
                INSERT INTO musician_skill (skill, musician_id)
                VALUES ($1, $2)
            
            `,
      [skill, id]
    );
  }
}

async function findByEmail(email: string): Promise<Musician | null> {
  const result = await connectionDb.query(
    ` SELECT  json_build_object(
        'id', musician.id,
        'name', name, 
        'email', email, 
        'date_of_birth', date_of_birth,
        'password', password,
        'skills', json_agg(musician_skill.skill)
    )
    
          FROM musician
          LEFT JOIN musician_skill ON musician_skill.musician_id = musician.id
          WHERE email = $1
          GROUP BY name, email, date_of_birth, password, musician.id
    `,
    [email]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0].json_build_object;
}

async function getById(id: Number): Promise<Musician | null> {
  const result = await connectionDb.query(
    ` SELECT  json_build_object(
        'name', name, 
        'email', email, 
        'date_of_birth', date_of_birth,
        'password', password,
        'skills', json_agg(musician_skill.skill)
    )
    
          FROM musician
          LEFT JOIN musician_skill ON musician_skill.musician_id = musician.id
          WHERE musician.id = $1
          GROUP BY name, email, date_of_birth, password

    `,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0].json_build_object;
}

export default {
  signup,
  findByEmail,
  getById,
};
