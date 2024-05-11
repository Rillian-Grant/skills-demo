import express from "express";
import { db, logger } from "./globals";
import Routes from "./routes";
import { PORT } from "./config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { MIGRATIONS_FOLDER } from "./config";
import { safetyNet500 } from "./middleware";

const app = express()

app.use("/", Routes);
app.use(safetyNet500)

migrate(db, {
    migrationsFolder: MIGRATIONS_FOLDER
})

app.listen(PORT, () =>
    logger.info({PORT}, "Server started")
);