import express from "express";
import pino from "pino";
import pino_http from "pino-http";
import { db, logger } from "./globals";
import { expressjwt } from "express-jwt";
import Routes from "./routes";
import { safetyNet500 } from "./middleware";
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