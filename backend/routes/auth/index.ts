import express, { Router } from "express";
import { validateBody } from "../../middleware";
import { RegisterUserReqSchema } from "./validators";

const router = Router();
router.use(express.json())

router.post(
    "/register",
    validateBody(RegisterUserReqSchema),
    async (req, res) => {
        res.json(req.body);
    }
)

export default router;