import { z } from "zod";

export const RegisterUserReqSchema = z.object({
    name: z.string().max(100),
    email: z.string().email(),
    password: z.string().min(8)
})