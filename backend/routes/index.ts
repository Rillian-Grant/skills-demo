import { Router } from "express";
import AuthRoutes from "./auth";
import RemindersRoutes from "./reminders";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/reminders", RemindersRoutes);

export default router;
