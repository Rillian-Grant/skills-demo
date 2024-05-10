import express, { NextFunction, Request as ExpressRequest, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, z } from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { pinoHttp } from "pino-http";
import { logger } from "./globals";

interface Request<T = any> extends ExpressRequest {
    body: T;
}

export function validateBody<T>(schema: z.ZodType<T>) { // Another any?
    return async (req: Request<T>, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST) // Bad Request
                    .json(error.format())
            } else {
                throw error
            }
        }
    }
}

export async function safetyNet500(req: Request, res: Response, next: NextFunction) {
    try {
        next();
    } catch (error) {
        req.log.error({ error }, "Internal server error")
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export interface JWTPayload extends jwt.JwtPayload {
    user_id: number
}

export interface AuthenticatedRequest extends ExpressRequest {
    user_id?: number
}

export function requireAuthentication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer TOKEN"
    if (!token) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JWTPayload; // We will only provide payloads
        req.user_id = payload.user_id;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        } else {
            throw error;
        }
    }
}

export const baseMiddleware = [
    safetyNet500,
    pinoHttp({
        logger
    }),
    express.json()
];