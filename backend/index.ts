import express from "express";
import { db, logger } from "./globals";
import Routes from "./routes";
import { PORT } from "./config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { MIGRATIONS_FOLDER } from "./config";

const app = express()

app.use("/", Routes);

migrate(db, {
    migrationsFolder: MIGRATIONS_FOLDER
})

app.listen(PORT, () =>
    logger.info({PORT}, "Server started")
);