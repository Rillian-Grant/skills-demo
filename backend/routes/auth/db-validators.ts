import { z } from "zod";
import { db } from "../../globals";
import { users } from "../../schema";
import { eq } from "drizzle-orm";
import {
  SchemaAuthRegisterReq,
  TypeAuthRegisterReq,
} from "../../../shared/validators";

async function userEmailIsUnique(email: string): Promise<boolean> {
  const res = await db.select().from(users).where(eq(users.email, email));
  return res.length == 0;
}

export const DBAuthRegisterReqSchema = SchemaAuthRegisterReq.extend({
  email: z.string().email().refine(userEmailIsUnique, "Email already in use"),
});
