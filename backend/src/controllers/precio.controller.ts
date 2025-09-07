import { Request, Response, NextFunction } from "express";
import { PrecioService } from "../services/precio.service";

/**
 * GET /api/precios
 * Devuelve el precio vigente 
 */
export const obtenerPrecio = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await PrecioService.obtenerVigente();
    res.json(p);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/precios
 * Actualiza el precio vigente (solo ADMIN). Body validado por Zod en middleware.
 */
export const actualizarPrecio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = (req.validated?.body ?? req.body) as {
      minutosPorBloque: number;         
      precioPorBloque: number;
      moneda?: "ARS" | "USD";
      vigenteDesde?: string;            
    };

    const actualizado = await PrecioService.actualizar({
      minutosPorBloque: 30,             
      precioPorBloque: body.precioPorBloque,
      moneda: body.moneda,
      vigenteDesde: body.vigenteDesde   
    });

    res.json(actualizado);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/precios/cotizaciones
 * Calcula cotización para un rango horario.
 */
export const cotizar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = (req.validated?.body ?? req.body) as {
      canchaId: string;
      inicio: string; 
      fin: string;    
    };

    const c = PrecioService.cotizar(body);
    res.json(c);
  } catch (err) {
    next(err);
  }
};
