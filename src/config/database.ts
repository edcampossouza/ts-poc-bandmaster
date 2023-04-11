import pg from "pg";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


dotenv.config();

const { Pool } = pg;

const connectionDb = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default connectionDb;
export { prisma };
