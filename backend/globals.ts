import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { MIGRATIONS_FOLDER } from "./config";
import { DB_PATH } from "./config";
import Database from "better-sqlite3";
import pino from 'pino';

const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite)

export const logger = pino();