import express, { Router } from "express";
import { JWTPayload, ah, baseMiddleware, requireAuthentication, validateBody } from "../../middleware";
import { DBAuthRegisterReqSchema } from "./db-validators";
import { db } from "../../globals";
import { users } from "../../schema";
import { comparePassword, hashPassword } from "./utils";
import { SchemaAuthLoginReq, TypeAuthLoginRes, TypeAuthRegisterRes } from "../../../shared/validators";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const router = Router();
router.use(...baseMiddleware)

router.post(
    "/register",
    validateBody(DBAuthRegisterReqSchema),
    ah(async (req, res) => {
        const password_hash = await hashPassword(req.body.password);

        const [{ id, name, email }] = await db.insert(users).values({
            email: req.body.email,
            name: req.body.name,
            password_hash
        }).returning(/* { id: user.id } */);

        return res.json({
            id,
            name: name ?? "",
            email
        } satisfies TypeAuthRegisterRes);
    })
)

router.post(
    "/login",
    validateBody(SchemaAuthLoginReq),
    ah(async (req, res) => {
        const user_entry = await db.select().from(users).where(eq(users.email, req.body.email));
        if (!user_entry.length) return res.sendStatus(StatusCodes.UNAUTHORIZED);

        const [{id, password_hash}] = user_entry;
        const password_correct = await comparePassword(password_hash, req.body.password);
        if (!password_correct) return res.sendStatus(StatusCodes.UNAUTHORIZED);

        const token = jwt.sign(
            { user_id: id } as JWTPayload,
            JWT_SECRET,
            {
                expiresIn: "30m" // TODO: Move to config file.
            }
        )

        return res.json({
            jwt: token
        } satisfies TypeAuthLoginRes)
    })
)

router.get(
    "/check",
    requireAuthentication,
    (req, res) => res.sendStatus(200)
)

export default router;