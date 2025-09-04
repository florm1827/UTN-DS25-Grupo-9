import { Reserva } from "../types/reserva.types";

const reservas: Reserva[] = []; 

export const ReservaModel = {
  listar(): Reserva[] {
    return reservas;
  },
  obtenerPorId(id: string): Reserva | undefined {
    return reservas.find(r => r.id === id);
  },
  crear(nueva: Reserva): Reserva {
    reservas.push(nueva);
    return nueva;
  },
  actualizar(indice: number, actualizada: Reserva): Reserva {
    reservas[indice] = actualizada;
    return actualizada;
  },
  indicePorId(id: string): number {
    return reservas.findIndex(r => r.id === id);
  }
};
