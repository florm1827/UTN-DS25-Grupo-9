import prisma from '../lib/prisma.js'

export const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id

    // borrar reservas del usuario (pendientes/aceptadas/canceladas/rechazadas)
    await prisma.reserva.deleteMany({ where: { usuarioId: userId } })

    // borrar usuario
    await prisma.usuario.delete({ where: { id: userId } })

    return res.json({ ok: true, msg: 'Cuenta eliminada correctamente' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al eliminar la cuenta' })
  }
}
