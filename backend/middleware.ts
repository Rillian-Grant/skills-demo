import { NextFunction, Request as ExpressRequest, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, z } from "zod";

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