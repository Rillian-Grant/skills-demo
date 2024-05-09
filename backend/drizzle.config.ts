import { defineConfig } from "drizzle-kit";
import { DB_PATH } from "./config";
import { MIGRATIONS_FOLDER } from "./config";

export default defineConfig({
    dialect: "sqlite",
    schema: "schema.ts",
    out: MIGRATIONS_FOLDER,
    dbCredentials: {
        url: DB_PATH
    }
});