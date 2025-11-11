import jwt from 'jsonwebtoken'

export const authRequired = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
      return res.status(401).json({ ok: false, msg: 'Token requerido' })
    }

    const [type, token] = header.split(' ')
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ ok: false, msg: 'Formato de token inválido' })
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      req.user = payload // { id, email, rol }
      // si la ruta pide roles y el rol del user no está
      if (roles.length > 0 && !roles.includes(payload.rol)) {
        return res.status(403).json({ ok: false, msg: 'No autorizado' })
      }
      next()
    } catch (err) {
      return res.status(401).json({ ok: false, msg: 'Token inválido o vencido' })
    }
  }
}
