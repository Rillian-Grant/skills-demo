import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import express from "express";
import { MIGRATIONS_FOLDER, PORT } from "./config";
import { db, logger } from "./globals";
import { safetyNet500 } from "./middleware";
import Routes from "./routes";

const app = express();

app.use("/", Routes);
app.use(safetyNet500);

migrate(db, {
  migrationsFolder: MIGRATIONS_FOLDER,
});

app.listen(PORT, () => logger.info({ PORT }, "Server started"));
