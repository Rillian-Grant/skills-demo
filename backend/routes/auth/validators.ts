import { z } from "zod";

export const RegisterUserReqSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8)
})