import express, { Router } from "express";
import { baseMiddleware, validateBody } from "../../middleware";
import { DBAuthRegisterReqSchema } from "./db-validators";
import { db } from "../../db";
import { user } from "../../schema";
import { hashPassword } from "./utils";
import { AuthRegisterResType } from "../../../shared/validators";

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

        res.json({
            id,
            name,
            email
        } as AuthRegisterResType);
    }
)

export default router;