-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'ACEPTADA', 'RECHAZADA');

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE';
