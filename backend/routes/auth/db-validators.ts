import { z } from "zod";
import { db } from "../../globals";
import { user } from "../../schema";
import { eq } from "drizzle-orm";
import { AuthRegisterReqSchema, AuthRegisterReqType } from "../../../shared/validators"

async function userEmailIsUnique(email: string): Promise<boolean> {
    const res = await db.select().from(user).where(eq(user.email, email));
    return res.length == 0
}

export const DBAuthRegisterReqSchema = AuthRegisterReqSchema.extend({
    email: z.string().email().refine(userEmailIsUnique, "Email already in use"),
})