import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Button,
  Alert,
  Stack,
} from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const CANCHAS = [
  'cancha1',
  'cancha2',
  'cancha3',
  'cancha4',
  'cancha5',
  'cancha6',
  'cancha7',
  'cancha8',
]

export default function AdminTurnos() {
  const { token, user } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [error, setError] = useState('')
  const [fecha, setFecha] = useState('')
  const [cancha, setCancha] = useState('')
  const [nombre, setNombre] = useState('')
  const [editando, setEditando] = useState(null)
  const [formEdit, setFormEdit] = useState({})

  const cargar = async () => {
    if (!token) return
    setError('')
    let url = `${API_URL}/reservas/admin/aceptadas`
    const params = []
    if (fecha) params.push(`fecha=${fecha}`)
    if (cancha) params.push(`cancha=${cancha}`)
    if (nombre) params.push(`nombre=${encodeURIComponent(nombre)}`)
    if (params.length) url += `?${params.join('&')}`

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudieron obtener las reservas')
        return
      }
      setTurnos(data.reservas)
    } catch (err) {
      setError('Error de red')
    }
  }

  useEffect(() => {
    if (token && user?.rol === 'ADMIN') {
      cargar()
    }
  }, [token, user, fecha, cancha, nombre])

  const iniciarEdicion = (turno) => {
    setEditando(turno.id)
    setFormEdit({
      cancha: turno.cancha,
      fecha: turno.fecha?.slice(0, 10),
      horaInicio: turno.horaInicio,
      horaFin: turno.horaFin,
      nombre: turno.nombre,
      comentario: turno.comentario || '',
    })
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setFormEdit({})
  }

  const guardarEdicion = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reservas/${id}/admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formEdit),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudo actualizar el turno')
        return
      }
      setEditando(null)
      cargar()
    } catch (err) {
      setError('Error de red')
    }
  }

  const darDeBaja = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reservas/${id}/baja`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: 'Baja realizada por administrador' }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudo dar de baja el turno')
        return
      }
      cargar()
    } catch (err) {
      setError('Error de red')
    }
  }

  if (user?.rol !== 'ADMIN') {
    return (
      <Box p={3}>
        <Alert severity="error">No tenés permisos para ver esta página.</Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Turnos aceptados
      </Typography>

      {/* filtros */}
      <Stack direction="row" spacing={2} mb={3} sx={{ flexWrap: 'wrap' }}>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          select
          label="Cancha"
          value={cancha}
          onChange={(e) => setCancha(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {CANCHAS.map((c) => (
            <MenuItem key={c} value={c}>
              {c.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Buscar por nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          size="small"
        />
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {turnos.length === 0 ? (
        <Typography>No hay turnos aceptados con esos filtros.</Typography>
      ) : (
        turnos.map((t) => (
          <Paper key={t.id} sx={{ p: 2, mb: 2 }}>
            {editando === t.id ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  select
                  label="Cancha"
                  value={formEdit.cancha}
                  onChange={(e) => setFormEdit((f) => ({ ...f, cancha: e.target.value }))}
                  size="small"
                >
                  {CANCHAS.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Fecha"
                  type="date"
                  value={formEdit.fecha}
                  onChange={(e) => setFormEdit((f) => ({ ...f, fecha: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Hora inicio"
                  value={formEdit.horaInicio}
                  onChange={(e) => setFormEdit((f) => ({ ...f, horaInicio: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Hora fin"
                  value={formEdit.horaFin}
                  onChange={(e) => setFormEdit((f) => ({ ...f, horaFin: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Nombre reserva"
                  value={formEdit.nombre}
                  onChange={(e) => setFormEdit((f) => ({ ...f, nombre: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Comentario"
                  value={formEdit.comentario}
                  onChange={(e) => setFormEdit((f) => ({ ...f, comentario: e.target.value }))}
                  size="small"
                  multiline
                  rows={2}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={() => guardarEdicion(t.id)}>
                    Guardar
                  </Button>
                  <Button variant="text" onClick={cancelarEdicion}>
                    Cancelar
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="subtitle1">
                  {t.cancha.toUpperCase()} — {t.fecha?.slice(0, 10)} — {t.horaInicio} a {t.horaFin}
                </Typography>
                <Typography variant="body2">
                  Reserva hecha por: {t.usuario?.nombre} ({t.usuario?.email})
                </Typography>
                <Typography variant="body2">Nombre reserva: {t.nombre}</Typography>
                {t.comentario && (
                  <Typography variant="body2" color="text.secondary">
                    Comentario: {t.comentario}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button variant="outlined" onClick={() => iniciarEdicion(t)}>
                    Modificar
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => darDeBaja(t.id)}>
                    Dar de baja
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        ))
      )}
    </Box>
  )
}
