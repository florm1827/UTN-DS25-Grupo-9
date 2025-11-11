import React, { useEffect, useState } from 'react'
import { Box, TextField, MenuItem, Button, Typography, Alert, Paper } from '@mui/material'
import Grilla from './Grilla'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const CANCHAS = ['cancha1','cancha2','cancha3','cancha4','cancha5','cancha6','cancha7','cancha8']

const generarHorarios = () => {
  const horas = []
  for (let h = 8; h <= 22; h++) {
    const hh = String(h).padStart(2, '0')
    horas.push(`${hh}:00`)
    if (h !== 22) horas.push(`${hh}:30`)
  }
  return horas
}
const HORARIOS = generarHorarios()

const TIPOS_USER = [
  { value: 'RESERVA', label: 'Reserva' },
  { value: 'TURNO_FIJO', label: 'Turno fijo' },
]
const TIPOS_ADMIN = [
  { value: 'RESERVA', label: 'Reserva' },
  { value: 'TURNO_FIJO', label: 'Turno fijo' },
  { value: 'CLASE', label: 'Clase' },
  { value: 'ESCUELA', label: 'Escuela' },
  { value: 'TORNEO', label: 'Torneo' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
]

export default function Formulario() {
  const { token, user } = useAuth()
  const hoy = new Date().toISOString().slice(0, 10)

  const [fecha, setFecha] = useState(hoy)
  const [cancha, setCancha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [tipo, setTipo] = useState('RESERVA')
  const [nombre, setNombre] = useState(user?.rol === 'ADMIN' ? '' : (user?.nombre || ''))

  const [reservas, setReservas] = useState([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  // 🔓 Cargar ACEPTADAS SIEMPRE (endpoint público)
  const cargarReservasAceptadas = async (fechaStr) => {
    try {
      const res = await fetch(`${API_URL}/reservas/aceptadas?fecha=${fechaStr}`)
      const data = await res.json()
      setReservas(data.ok ? (data.reservas || []) : [])
    } catch {
      setReservas([])
    }
  }

  useEffect(() => {
    cargarReservasAceptadas(fecha)
    if (user && user.rol !== 'ADMIN') setNombre(user?.nombre || '')
  }, [fecha, user])

  const haySolape = ({ cancha, horaInicio, horaFin }) =>
    reservas.some((r) => r.cancha === cancha && horaInicio < r.horaFin && horaFin > r.horaInicio)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    if (!token) return setError('Iniciá sesión para poder reservar')
    if (!fecha || !cancha || !horaInicio || !horaFin) return setError('Completá todos los campos')
    if (horaInicio >= horaFin) return setError('La hora de inicio debe ser menor que la de fin')

    const nombreFinal = user?.rol === 'ADMIN' ? (nombre || 'Reserva') : (user?.nombre || 'Reserva')
    const payload = { cancha, horaInicio, horaFin, fecha, nombre: nombreFinal, tipo }

    if (haySolape(payload)) return setError('Ya existe una reserva ACEPTADA para esa cancha y horario')

    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'Error al enviar la solicitud')
      setMsg('Solicitud enviada. Esperando aprobación del administrador.')
      setCancha(''); setHoraInicio(''); setHoraFin('')
      if (user?.rol === 'ADMIN') setNombre('')
      cargarReservasAceptadas(fecha)
    } catch {
      setError('Error de conexión con el servidor')
    }
  }

  const tipos = user?.rol === 'ADMIN' ? TIPOS_ADMIN : TIPOS_USER

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3, flexWrap: 'wrap' }}>
      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{ p: 2, width: 360, display: 'flex', flexDirection: 'column', gap: 2 }}
        elevation={2}
      >
        <Typography variant="h6">Solicitar reserva</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {msg && <Alert severity="success">{msg}</Alert>}

        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e)=>setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          select
          label="Cancha"
          value={cancha}
          onChange={(e)=>setCancha(e.target.value)}
          required
        >
          {CANCHAS.map(c => <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Hora inicio"
          value={horaInicio}
          onChange={(e)=>setHoraInicio(e.target.value)}
          required
        >
          {HORARIOS.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Hora fin"
          value={horaFin}
          onChange={(e)=>setHoraFin(e.target.value)}
          required
        >
          {HORARIOS.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
        </TextField>

        <TextField
          select
          label="Tipo"
          value={tipo}
          onChange={(e)=>setTipo(e.target.value)}
        >
          {tipos.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
        </TextField>

        {user?.rol === 'ADMIN' && (
          <TextField
            label="Nombre de la reserva"
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
            placeholder="Ej: Torneo / Escuela / Clase"
          />
        )}

        <Button type="submit" variant="contained">
          Enviar solicitud
        </Button>
      </Paper>

      <Box sx={{ flex: 1, minWidth: 480 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Reservas aceptadas del día {fecha}
        </Typography>
        <Grilla reservas={reservas} fecha={fecha} />
      </Box>
    </Box>
  )
}
