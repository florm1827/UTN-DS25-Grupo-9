import React, { useEffect, useState } from 'react'
import { Box, TextField, MenuItem, Button, Typography, Alert } from '@mui/material'
import Grilla from './Grilla'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const canchas = [
  'cancha1',
  'cancha2',
  'cancha3',
  'cancha4',
  'cancha5',
  'cancha6',
  'cancha7',
  'cancha8',
]

// generamos horarios cada 30'
const generarHorarios = () => {
  const horas = []
  for (let h = 8; h <= 22; h++) {
    // 08:00
    const hh = h.toString().padStart(2, '0')
    horas.push(`${hh}:00`)
    // 08:30 (salvo que sea 22:00)
    if (h !== 22) {
      horas.push(`${hh}:30`)
    }
  }
  return horas
}
const HORARIOS = generarHorarios()

export default function FormularioConGrilla() {
  const { token } = useAuth()
  const hoy = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const [fecha, setFecha] = useState(hoy)
  const [cancha, setCancha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [reservas, setReservas] = useState([]) // aceptadas del día seleccionado

  // cargar reservas aceptadas del día seleccionado
  const fetchReservas = async (fechaSeleccionada) => {
    if (!token) return
    const res = await fetch(`${API_URL}/reservas?fecha=${fechaSeleccionada}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (data.ok) {
      setReservas(data.reservas)
    }
  }

  useEffect(() => {
    fetchReservas(fecha)
  }, [fecha, token])

  // validación de solapamiento en frontend también
  const haySolapamientoFrontend = (nuevaReserva) => {
    // reservas aceptadas de ese día ya están en "reservas"
    return reservas.some((r) => {
      return (
        r.cancha === nuevaReserva.cancha &&
        nuevaReserva.horaInicio < r.horaFin &&
        nuevaReserva.horaFin > r.horaInicio
      )
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (!token) {
      setError('Debes iniciar sesión para reservar')
      return
    }

    if (!cancha || !horaInicio || !horaFin || !nombre || !fecha) {
      setError('Completá todos los campos')
      return
    }

    if (horaInicio >= horaFin) {
      setError('La hora de inicio debe ser menor que la hora de fin')
      return
    }

    const nuevaReserva = {
      cancha,
      horaInicio,
      horaFin,
      nombre,
      fecha,
    }

    // chequeo en frontend
    if (haySolapamientoFrontend(nuevaReserva)) {
      setError('Ya hay una reserva aceptada en ese horario para esa cancha')
      return
    }

    // enviar al backend
    const res = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaReserva),
    })

    const data = await res.json()
    if (!res.ok || !data.ok) {
      setError(data.msg || 'Error al enviar la solicitud')
      return
    }

    setMensaje('Solicitud enviada. Esperando aprobación del administrador.')
    // limpiar form (pero dejamos fecha)
    setCancha('')
    setHoraInicio('')
    setHoraFin('')
    setNombre('')

    // recargar aceptadas del día
    fetchReservas(fecha)
  }

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 3, flexWrap: 'wrap' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 300,
        }}
      >
        <Typography variant="h6">Solicitar reserva</Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {mensaje && <Alert severity="success">{mensaje}</Alert>}

        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          select
          label="Cancha"
          value={cancha}
          onChange={(e) => setCancha(e.target.value)}
          fullWidth
          required
        >
          {canchas.map((c) => (
            <MenuItem key={c} value={c}>
              {c.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Hora inicio"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          fullWidth
          required
        >
          {HORARIOS.map((h) => (
            <MenuItem key={h} value={h}>
              {h}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Hora fin"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          fullWidth
          required
        >
          {HORARIOS.map((h) => (
            <MenuItem key={h} value={h}>
              {h}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          required
        />

        <Button type="submit" variant="contained">
          Enviar solicitud
        </Button>
      </Box>

      {/* grilla con aceptadas del día */}
      <Box sx={{ flex: 1, minWidth: 400 }}>
        <Grilla reservas={reservas} fecha={fecha} />
      </Box>
    </Box>
  )
}
