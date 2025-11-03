import React, { useEffect, useState } from 'react'
import { Box, Typography, Alert, Paper, Button } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Notificaciones() {
  const { token } = useAuth()
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/reservas/mias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudieron obtener las notificaciones')
        setLoading(false)
        return
      }
      setReservas(data.reservas)
    } catch (err) {
      setError('Error de red')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [token])

  const cancelar = async (id) => {
    setError('')
    try {
      const res = await fetch(`${API_URL}/reservas/mias/${id}/cancelar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudo cancelar la reserva')
        return
      }
      cargar()
    } catch (err) {
      setError('Error de red')
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Mis solicitudes y reservas
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Typography>Cargando...</Typography>}

      {!loading && reservas.length === 0 && (
        <Typography>No tenés solicitudes todavía.</Typography>
      )}

      {!loading &&
        reservas.map((r) => (
          <Paper key={r.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">
              {r.cancha?.toUpperCase()} — {r.fecha?.slice(0, 10)} — {r.horaInicio} a {r.horaFin}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Estado:{' '}
              {r.estado === 'ACEPTADA'
                ? '✅ Aceptada'
                : r.estado === 'PENDIENTE'
                ? '🕒 Pendiente'
                : r.estado === 'RECHAZADA'
                ? '❌ Rechazada'
                : '🚫 Cancelada'}
            </Typography>
            {r.comentario && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Comentario del administrador: {r.comentario}
              </Typography>
            )}

            {/* solo puedo cancelar si está pendiente */}
            {r.estado === 'PENDIENTE' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => cancelar(r.id)}
              >
                Cancelar solicitud
              </Button>
            )}
          </Paper>
        ))}
    </Box>
  )
}
