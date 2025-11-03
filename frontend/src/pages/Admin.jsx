import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Button, Alert, TextField, MenuItem } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const CANCHAS = ['cancha1','cancha2','cancha3','cancha4','cancha5','cancha6','cancha7','cancha8']

export default function AdminPage() {
  const { token, user } = useAuth()
  const [pendientes, setPendientes] = useState([])
  const [error, setError] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().slice(0,10))
  const [canchaFiltro, setCanchaFiltro] = useState('')
  const [comentarios, setComentarios] = useState({}) // id → texto

  const fetchPendientes = async () => {
    setError('')
    let url = `${API_URL}/reservas/pendientes`
    const params = []
    if (fechaFiltro) params.push(`fecha=${fechaFiltro}`)
    if (canchaFiltro) params.push(`cancha=${canchaFiltro}`)
    if (params.length) url += '?' + params.join('&')

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudieron obtener las solicitudes')
        return
      }
      setPendientes(data.reservas)
    } catch (err) {
      setError('Error de red')
    }
  }

  useEffect(() => {
    if (token && user?.rol === 'ADMIN') {
      fetchPendientes()
    }
  }, [token, user, fechaFiltro, canchaFiltro])

  const handleAccion = async (id, accion) => {
    const comentario = comentarios[id] || ''
    try {
      const res = await fetch(`${API_URL}/reservas/${id}/${accion}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudo actualizar la reserva')
        return
      }
      fetchPendientes()
    } catch {
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
      <Typography variant="h4" mb={2}>Solicitudes de reservas</Typography>

      {/* filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Fecha"
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Cancha"
          value={canchaFiltro}
          onChange={(e) => setCanchaFiltro(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {CANCHAS.map((c) => (
            <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>
          ))}
        </TextField>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {pendientes.length === 0 ? (
        <Typography>No hay solicitudes pendientes.</Typography>
      ) : (
        pendientes.map((r) => (
          <Paper key={r.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">
              {r.nombre} pidió {r.cancha.toUpperCase()}
            </Typography>
            <Typography variant="body2">
              {r.fecha?.slice(0, 10)} | {r.horaInicio} - {r.horaFin}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Usuario: {r.usuario?.nombre} ({r.usuario?.email})
            </Typography>

            <TextField
              label="Comentario"
              size="small"
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 1 }}
              value={comentarios[r.id] || ''}
              onChange={(e) =>
                setComentarios({ ...comentarios, [r.id]: e.target.value })
              }
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAccion(r.id, 'aceptar')}
              >
                Aceptar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleAccion(r.id, 'rechazar')}
              >
                Rechazar
              </Button>
            </Box>

            {r.comentario && (
              <Typography variant="caption" color="text.secondary">
                Comentario previo: {r.comentario}
              </Typography>
            )}
          </Paper>
        ))
      )}
    </Box>
  )
}
