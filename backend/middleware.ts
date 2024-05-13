import express, {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
  RequestHandler,
} from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, z } from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { pinoHttp } from "pino-http";
import { logger } from "./globals";

/**
 * ah - Async Handler
 * @param f Your async handler function
 * @returns A non-async handler function that passes errors to next
 */
export function ah(f: RequestHandler): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(f(req, res, next)).catch(next);
  };
}

interface Request<T = any> extends ExpressRequest {
  body: T;
}

export function validateBody<T>(schema: z.ZodType<T>) {
  // Another any?
  return async (req: Request<T>, res: ExpressResponse, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(StatusCodes.BAD_REQUEST) // Bad Request
          .json(error.format());
      } else {
        throw error;
      }
    }
  };
}

export function safetyNet500(
  err: Error,
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) {
  req.log.error({ err }, "Internal server error");
  res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}

export interface JWTPayload extends jwt.JwtPayload {
  user_id: number;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user_id?: number;
}

// TODO: Find out if it is possible to make it so that requireAuthentication takes in ExpressRequest but outputs AuthenticatedRequest
export function requireAuthentication(
  req: AuthenticatedRequest,
  res: ExpressResponse,
  next: NextFunction,
) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer TOKEN"
  if (!token) return res.sendStatus(StatusCodes.UNAUTHORIZED);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload; // We will only provide payloads
    req.user_id = payload.user_id!;
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
  //    safetyNet500,
  pinoHttp({
    logger,
    autoLogging: false,
  }),
  express.json(),
];
