import express from "express";
import pino from "pino";
import pino_http from "pino-http";

const PORT = 8080

const logger = pino()
const app = express()
app.use(pino_http({
    logger
}))

app.get("/", (req, res) => {
    req.log.info("Hello World")
    res.send("Hello World")
})

app.listen(PORT, () => {
    logger.info({PORT}, "Server started")
})