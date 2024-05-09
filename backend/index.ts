import express from "express";
import pino from "pino";
import pino_http from "pino-http";
import { performMigrations } from "./db";
import { expressjwt } from "express-jwt";
import Routes from "./routes";

const PORT = 8080

const logger = pino()
const app = express()
app.use(express.json())
app.use(pino_http({
    logger
}))
// app.use(expressjwt({
//     secret: "test",
//     algorithms: ["HS256"]
// }).unless({
//     path: [
//         "/auth"
//     ]
// }))

app.use("/", Routes)

performMigrations().then(() =>
    app.listen(PORT, () =>
        logger.info({PORT}, "Server started")
    )
)
