import { z } from "zod";
import { db } from "../../db";
import { user } from "../../schema";
import { eq } from "drizzle-orm";

async function userEmailIsUnique(email: string): Promise<boolean> {
    const res = await db.select().from(user).where(eq(user.email, email));
    return res.length == 0
}

export const RegisterUserReqSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email().refine(userEmailIsUnique, "Email already in use"),
    password: z.string().min(8)
})
export type RegisterUserReqType = z.infer<typeof RegisterUserReqSchema>;
export type RegisterUserResType = {
    id: number;
    name: string;
    email: string;
};
