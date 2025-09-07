import { prisma } from "./prisma";
async function main() {
  const c1 = await prisma.cancha.upsert({
    where: { nombre: "Cancha 1" },
    update: {},
    create: { nombre: "Cancha 1", estado: "HABILITADA" }
  });
  const c2 = await prisma.cancha.upsert({
    where: { nombre: "Cancha 2" },
    update: {},
    create: { nombre: "Cancha 2", estado: "HABILITADA" }
  });
  await prisma.precio.upsert({
    where: { id: 1 },
    update: { precioPorBloque: 3000, moneda: "ARS" },
    create: { id: 1, minutosPorBloque: 30, precioPorBloque: 3000, moneda: "ARS" }
  });
  console.log("✅ Seed listo", c1.id, c2.id);
}
main().finally(()=>prisma.$disconnect());
