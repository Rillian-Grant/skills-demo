import express, { Router } from "express";
import { validateBody } from "../../middleware";
import { RegisterUserReqSchema } from "./validators";
import { db } from "../../db";
import { user } from "../../schema";
import { hashPassword } from "./utils";
import { DrizzleError } from "drizzle-orm";
import { RegisterUserResType } from "./validators";

const router = Router();
router.use(express.json())

router.post(
    "/register",
    validateBody(RegisterUserReqSchema),
    async (req, res) => {
        const password_hash = await hashPassword(req.body.password);

        const [{ id, name, email }] = await db.insert(user).values({
            email: req.body.email,
            name: req.body.name,
            password_hash
        }).returning(/* { id: user.id } */);

        res.json({
            id,
            name,
            email
        } as RegisterUserResType);
    }
)

export default router;