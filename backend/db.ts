import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { MIGRATIONS_FOLDER } from "./config";
import { DB_PATH } from "./config";
import Database from "better-sqlite3";

const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite)

export async function performMigrations() {
    await migrate(db, {
        migrationsFolder: MIGRATIONS_FOLDER
    })
}