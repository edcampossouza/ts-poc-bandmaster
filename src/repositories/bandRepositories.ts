import { Band, BandInput } from "../protocols/Band.js";
import connectionDb from "../config/database.js";
import { Musician } from "../protocols/Musician.js";
import { BandQuery } from "../protocols/Queries.js";
import { QueryCondition, WhereClause, buildWhereClause } from "./util.js";

async function getByName(name: string, { exact = false }): Promise<Band[]> {
  const bandQuery: BandQuery = exact ? { nameExact: name } : { name: name };
  const result = await getBandsFromQuery(bandQuery);
  return result;
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

async function bandMembers(bandId: number) {
  const results = await connectionDb.query(
    `
            SELECT  json_build_object(
                'id', musician.id,
                'name', name, 
                'email', email, 
                'date_of_birth', date_of_birth,
                'skills', json_agg(musician_skill.skill)
            )
            
                FROM musician
                JOIN musician_band on musician_band.musician_id = musician.id
                LEFT JOIN musician_skill ON musician_skill.musician_id = musician.id
                WHERE musician_band.band_id = $1 AND accepted_at IS NOT NULL
                GROUP BY name, email, date_of_birth, musician.id
        `,
    [bandId]
  );
  return results.rows.map((x) => x.json_build_object);
}

function buildBandQuery(query: BandQuery): WhereClause {
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
      column: "lower(band.name)",
      operator: "LIKE",
      variable: `%${query.name.toLowerCase()}%`,
    });
  }
  if (query.nameExact) {
    conditions.push({
      column: "band.name",
      operator: "LIKE",
      variable: query.nameExact,
    });
  }
  if (query.style) {
    conditions.push({
      column: "lower(band.style)",
      operator: "LIKE",
      variable: `%${query.style.toLowerCase()}%`,
    });
  }
  if (query.city) {
    conditions.push({
      column: "lower(band.city)",
      operator: "LIKE",
      variable: `%${query.city.toLowerCase()}%`,
    });
  }
  return buildWhereClause(conditions);
}

async function executeBandQuery(clause: WhereClause): Promise<Band[]> {
  const bands = (
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
        ${clause.clause}
        GROUP BY band.id, founder.id, band.name
    
  `,
      clause.varArray
    )
  ).rows.map((r) => r.json_build_object);
  for (const band of bands) {
    band.members = await bandMembers(band.id);
  }
  return bands;
}

async function getBandsFromQuery(query: BandQuery): Promise<Band[]> {
  const clause: WhereClause = buildBandQuery(query);
  const results = await executeBandQuery(clause);
  return results;
}

async function invite({ bandId, musicianId }): Promise<void> {
  await connectionDb.query(
    `
      INSERT INTO musician_band (musician_id, band_id)
      VALUES ($1, $2)
    `,
    [musicianId, bandId]
  );
}

export default {
  getByName,
  create,
  getBandsFromQuery,
  invite,
};
