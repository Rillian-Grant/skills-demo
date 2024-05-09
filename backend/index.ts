import express from "express";
import pino from "pino";
import pino_http from "pino-http";
import { performMigrations } from "./db";
import { expressjwt } from "express-jwt";
import authRouter from "./auth";

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

app.get("/", (req, res) => {
    req.log.info("Hello World")
    res.send("Hello World")
})

app.use("/auth", authRouter)

performMigrations().then(() =>
    app.listen(PORT, () =>
        logger.info({PORT}, "Server started")
    )
)
