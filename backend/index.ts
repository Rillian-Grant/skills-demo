import express from "express";
import pino from "pino";
import pino_http from "pino-http";
import { performMigrations } from "./db";
import { expressjwt } from "express-jwt";
import Routes from "./routes";
import { safetyNet500 } from "./middleware";
import { PORT } from "./config";

const logger = pino()
const app = express()

app.use("/", Routes);

performMigrations();

app.listen(PORT, () =>
    logger.info({PORT}, "Server started")
);