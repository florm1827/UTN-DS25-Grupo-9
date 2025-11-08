import React, { useEffect, useState } from 'react'
import {
  Container, Card, CardHeader, CardContent, CardActions,
  Typography, Alert, Button, Stack, Chip, Divider, Box, CircularProgress
} from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Notificaciones() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // 🚫 bloqueo si no hay sesión
  useEffect(() => {
    if (!token) {
      navigate('/log', { replace: true, state: { from: '/notificaciones' } })
    }
  }, [token, navigate])

  const cargar = async () => {
    if (!token) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_URL}/reservas/mias`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'No se pudieron obtener las notificaciones')
      setReservas(data.reservas)
    } catch {
      setError('Error de red')
    } finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [token])

  const cancelar = async (id) => {
    setError('')
    try {
      const res = await fetch(`${API_URL}/reservas/mias/${id}/cancelar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'No se pudo cancelar la reserva')
      cargar()
    } catch { setError('Error de red') }
  }

  const badge = (estado) => {
    switch (estado) {
      case 'ACEPTADA': return <Chip label="ACEPTADA" color="success" size="small" />
      case 'PENDIENTE': return <Chip label="PENDIENTE" color="warning" size="small" />
      case 'RECHAZADA': return <Chip label="RECHAZADA" color="error" variant="outlined" size="small" />
      case 'CANCELADA': return <Chip label="CANCELADA" variant="outlined" size="small" />
      default: return null
    }
  }

  return (
    <>
      <Header />
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card variant="outlined">
        <CardHeader title="Mis notificaciones" subheader="Seguimiento de solicitudes y reservas" />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : reservas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography>No tenés solicitudes todavía.</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {reservas.map(r => (
                <Card key={r.id} variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                      <Box>
                        <Typography variant="h6">{r.cancha?.toUpperCase()}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {r.fecha?.slice(0,10)} — {r.horaInicio} a {r.horaFin}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {badge(r.estado)}
                          <Chip label={`Nombre reserva: ${r.nombre}`} size="small" variant="outlined" />
                        </Stack>
                        {r.comentario && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Comentario del administrador: {r.comentario}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    {r.estado === 'PENDIENTE' && (
                      <Button variant="outlined" color="error" onClick={()=>cancelar(r.id)}>
                        Cancelar solicitud
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={()=>navigate('/alq')} variant="text">Ir a reservar</Button>
        </CardActions>
      </Card>
    </Container>
    </>
  )
}
