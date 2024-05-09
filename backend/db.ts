import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { dbPath, migrationsFolder } from './drizzle.config';
import Database from "better-sqlite3";

const sqlite = new Database(dbPath);
const db = drizzle(sqlite)

export async function performMigrations() {
    await migrate(db, {
        migrationsFolder
    })
}