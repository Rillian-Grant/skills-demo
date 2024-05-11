import { Router } from "express";
import { AuthenticatedRequest, ah, baseMiddleware, requireAuthentication, safetyNet500, validateBody } from "../../middleware";
import { SchemaReminderPatchReq, SchemaReminderPostReq, TypeReminderGet, TypeReminderIdGet, TypeReminderPatchRes, TypeReminderPostRes } from "../../../shared/validators";
import { db, sqids } from "../../globals";
import { reminders, users as users } from "../../schema";
import { and, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

const router = Router();
router.use(
    ...baseMiddleware,
    requireAuthentication
);

// GET /reminders
router.get(
    "/",
    ah(async (req: AuthenticatedRequest, res, next) => {
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
    })
)

// POST /reminders
router.post(
    "/",
    validateBody(SchemaReminderPostReq),
    ah(async (req: AuthenticatedRequest, res) => {
        const [reminder] = await db.insert(reminders).values({
            ...req.body,
            user_id: req.user_id
        }).returning(); // SchemaReminderPostReq (req.body) and schema types are compatable

        return res.json({
            id: sqids.encode([reminder.id]),
            name: reminder.name,
            content: reminder.content,
            due_at: reminder.due_at,
            completed_at: reminder.completed_at
        } satisfies TypeReminderPostRes)
    })
)

// GET /reminders/:id
router.get(
    "/:id",
    ah(async (req: AuthenticatedRequest, res) => {
        const [numeric_id] = sqids.decode(req.params.id)
        const [reminder] = await db.select().from(reminders).where(
            and(
                eq(reminders.id, numeric_id),
                eq(reminders.user_id, req.user_id!)
            )
        )
        if (!reminder) return res.sendStatus(StatusCodes.NOT_FOUND);

        return res.json({
            id: req.params.id,
            name: reminder.name,
            content: reminder.content,
            due_at: reminder.due_at,
            completed_at: reminder.completed_at
        } satisfies TypeReminderIdGet)
    })
)

// PATCH /reminders/:id
router.patch(
    "/:id",
    validateBody(SchemaReminderPatchReq),
    ah(async (req: AuthenticatedRequest, res) => {
        const [numeric_id] = sqids.decode(req.params.id)
        const [reminder] = await db.update(reminders)
            .set({
                name: req.body.name ?? undefined,
                content: req.body.content ?? undefined,
                due_at: req.body.due_at ?? undefined,
                completed_at: req.body.completed_at ?? undefined
            }).where(and(
                eq(reminders.id, numeric_id),
                eq(reminders.user_id, req.user_id!)
            )).returning();
        if (!reminder) return res.sendStatus(StatusCodes.NOT_FOUND);

        return res.json({
            id: req.params.id,
            name: reminder.name,
            content: reminder.content,
            due_at: reminder.due_at,
            completed_at: reminder.completed_at
        } satisfies TypeReminderPatchRes)
    })
)

// DELETE /reminders/:id
router.delete(
    "/:id",
    ah(async (req: AuthenticatedRequest, res) => {
        const [numeric_id] = sqids.decode(req.params.id)
        const [reminder] = await db.delete(reminders).where(
            and(
                eq(reminders.user_id, req.user_id!),
                eq(reminders.id, numeric_id)
            )
        ).returning();

        if (!reminder) return res.sendStatus(StatusCodes.NOT_FOUND);

        return res.send()
    })
)

export default router;