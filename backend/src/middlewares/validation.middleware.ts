import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";


declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export function validarBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.validated = { ...(req.validated ?? {}), body: parsed };
      next();
    } catch (err) {
      manejarZod(err, next);
    }
  };
}

export function validarQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.validated = { ...(req.validated ?? {}), query: parsed };
      next();
    } catch (err) {
      manejarZod(err, next);
    }
  };
}

export function validarParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.validated = { ...(req.validated ?? {}), params: parsed };
      next();
    } catch (err) {
      manejarZod(err, next);
    }
  };
}

function manejarZod(err: unknown, next: NextFunction) {
  if (err instanceof ZodError) {
    const e: any = new Error("Error de validación");
    e.statusCode = 400;
    e.details = err.flatten();
    return next(e);
  }
  next(err);
}
