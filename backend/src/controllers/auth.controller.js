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

    const user = await prisma.usuario.findUnique({
      where: { email },
    })
    if (!user) {
      return res.status(400).json({ ok: false, msg: 'Credenciales inválidas' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(400).json({ ok: false, msg: 'Credenciales inválidas' })
    }

    const token = signToken(user)

    return res.json({
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

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: { id: true, nombre: true, email: true, rol: true },
    })
    return res.json({ ok: true, user })
  } catch (err) {
    return res.status(500).json({ ok: false, msg: 'Error en el servidor' })
  }
}
