import { Musician, MusicianInput } from "../protocols/Musician";

import connectionDb from "../config/database.js";
import { MusicianQuery } from "../protocols/Queries";
import { QueryCondition, WhereClause, buildWhereClause } from "./util.js";

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

async function getMusiciansFromQuery(
  query: MusicianQuery
): Promise<Musician[]> {
  const clause: WhereClause = buildMusicianQuery(query);
  const results = await executeMusicianQuery(clause);
  return results;
}

export default {
  signup,
  findByEmail,
  getById,
  getMusiciansFromQuery,
};

function buildMusicianQuery(query: MusicianQuery): WhereClause {
  const conditions: QueryCondition[] = [];
  if (query.id) {
    conditions.push({
      column: "band.id",
      operator: "=",
      variable: query.id,
    });
  }
  if (query.name) {
    conditions.push({
      column: "lower(musician.name)",
      operator: "LIKE",
      variable: `%${query.name.toLowerCase()}%`,
    });
  }
  if (query.skill) {
    conditions.push({
      column: "",
      operator: "",
      variable: `%${query.skill.toLowerCase()}%`,
      tostring:
        "EXISTS (SELECT 1 FROM musician_skill WHERE musician_skill.musician_id = musician.id AND musician_skill.skill like __VAR__)",
      inverted: true,
    });
  }
  return buildWhereClause(conditions);
}

async function executeMusicianQuery(clause: WhereClause): Promise<Musician[]> {
  const result = (
    await connectionDb.query(
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
          ${clause.clause}
          GROUP BY name, email, date_of_birth, password, musician.id

    `,
      clause.varArray
    )
  ).rows.map((r) => r.json_build_object);

  return result;
}
