// src/controllers/auth.controller.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  )
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    // ¿ya existe?
    const userFound = await prisma.usuario.findUnique({
      where: { email },
    })
    if (userFound) {
      return res.status(400).json({ ok: false, msg: 'El email ya está registrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // 👇 siempre creamos USER desde el registro público
    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash,
        rol: 'USER', // el ADMIN lo creamos a mano o desde un endpoint protegido
      },
    })

    const token = signToken(user)

    return res.status(201).json({
      ok: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error en el servidor' })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'Email y contraseña son obligatorios' })
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(400).json({ ok: false, msg: 'Credenciales inválidas' })
    }

    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) {
      return res.status(400).json({ ok: false, msg: 'Credenciales inválidas' })
    }

    // ✅ Incluir NOMBRE en el payload del token
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre, // 👈 aquí va el nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      ok: true,
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre, // 👈 también en la respuesta
        rol: usuario.rol,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al iniciar sesión' })
  }
}

// GET /api/auth/me
// src/controllers/auth.controller.js
export const me = async (req, res) => {
  try {
    // req.user viene del middleware que verifica el token
    const { id, email, nombre, rol } = req.user
    return res.json({ ok: true, user: { id, email, nombre, rol } })
  } catch {
    return res.status(401).json({ ok: false, msg: 'Token inválido' })
  }
}
