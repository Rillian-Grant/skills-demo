import { z } from "zod";

export const AuthRegisterReqSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8)
})
export type AuthRegisterReqType = z.infer<typeof AuthRegisterReqSchema>;
export type AuthRegisterResType = {
    id: number;
    name: string;
    email: string;
};

export const AuthLoginReqSchema = z.object({
    email: z.string().email(),
    password: z.string()
})
export type AuthLoginReqType = z.infer<typeof AuthLoginReqSchema>;
export type AuthLoginResType = {
    jwt: string
}