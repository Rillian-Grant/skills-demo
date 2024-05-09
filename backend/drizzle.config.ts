import { defineConfig } from "drizzle-kit";

export const dbPath = "./db.sqlite"
export const migrationsFolder = "./migrations"

export default defineConfig({
    dialect: "sqlite",
    schema: "schema.ts",
    out: migrationsFolder,
    dbCredentials: {
        url: dbPath
    }
});