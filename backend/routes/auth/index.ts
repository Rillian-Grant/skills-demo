import express, { Router } from "express";
import { JWTPayload, baseMiddleware, requireAuthentication, validateBody } from "../../middleware";
import { DBAuthRegisterReqSchema } from "./db-validators";
import { db } from "../../db";
import { user } from "../../schema";
import { comparePassword, hashPassword } from "./utils";
import { AuthLoginReqSchema, AuthLoginResType, AuthRegisterResType } from "../../../shared/validators";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const router = Router();
router.use(...baseMiddleware)

router.post(
    "/register",
    validateBody(DBAuthRegisterReqSchema),
    async (req, res) => {
        const password_hash = await hashPassword(req.body.password);

        const [{ id, name, email }] = await db.insert(user).values({
            email: req.body.email,
            name: req.body.name,
            password_hash
        }).returning(/* { id: user.id } */);

        return res.json({
            id,
            name: name ?? "",
            email
        } satisfies AuthRegisterResType);
    }
)

router.post(
    "/login",
    validateBody(AuthLoginReqSchema),
    async (req, res) => {
        const user_entry = await db.select().from(user).where(eq(user.email, req.body.email));
        if (!user_entry.length) return res.sendStatus(StatusCodes.UNAUTHORIZED);

        const [{id, password_hash}] = user_entry;
        if (!comparePassword(password_hash, req.body.password)) return res.sendStatus(StatusCodes.UNAUTHORIZED);

        const token = jwt.sign(
            { user_id: id } as JWTPayload,
            JWT_SECRET
        )

        return res.json({
            jwt: token
        } satisfies AuthLoginResType)
    }
)

router.get(
    "/check",
    requireAuthentication,
    (req, res) => res.sendStatus(200)
)

export default router;