import { Router } from "express";
import { AuthenticatedRequest, baseMiddleware, requireAuthentication, validateBody } from "../../middleware";
import { SchemaReminderPostReq, TypeReminderGet, TypeReminderPostRes } from "../../../shared/validators";
import { db, sqids } from "../../globals";
import { reminders, users as users } from "../../schema";
import { eq } from "drizzle-orm";

const router = Router();
router.use(
    ...baseMiddleware,
    requireAuthentication
);

// GET /reminders
router.get(
    "/",
    async (req: AuthenticatedRequest, res, next) => {
        const users_reminders = await db.select().from(reminders).where(eq(reminders.user_id, req.user_id!)) /* Shouldn't need to do this ! */
        return res.json(
            users_reminders.map(
                r => ({
                    id: sqids.encode([r.id]),
                    name: r.name,
                    content: r.content,
                    due_at: r.due_at,
                    completed_at: r.completed_at
                })
            ) satisfies TypeReminderGet
        )
    }
)

// POST /reminders
router.post(
    "/",
    validateBody(SchemaReminderPostReq),
    async (req: AuthenticatedRequest, res) => {
        const [reminder] = await db.insert(reminders).values({
            ...req.body,
            user_id: req.user_id
        }).returning(); // SchemaReminderPostReq (req.body) and schema types are compatable

        return res.json({
            ...reminder,
            id: sqids.encode([reminder.id])
        } satisfies TypeReminderPostRes)
    }
)

// GET /reminders/:id

// PATCH /reminders/:id

// DELETE /reminders/:id

export default router;