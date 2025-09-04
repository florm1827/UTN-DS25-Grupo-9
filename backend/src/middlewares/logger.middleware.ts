import { Request, Response, NextFunction  } from 'express';
export function logRequest (req: Request, res: Response, next: NextFunction ) {
  const timestamp = new Date().toISOString ();
  const method = req.method;
  const url = req.url;
  console.log(`[${timestamp}] ${method} ${url}`);
  // ¡FUNDAMENTAL! Llamar next() para continuar
  next();
}