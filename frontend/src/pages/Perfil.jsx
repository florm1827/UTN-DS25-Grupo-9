import React, { useState } from 'react'
import {
  Container, Card, CardHeader, CardContent, CardActions,
  Typography, Button, Stack, Divider, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Alert
} from '@mui/material'
import Header from '../components/Header.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Perfil() {
  const { user, token, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const darDeBaja = async () => {
    setError('')
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.msg || 'No se pudo dar de baja la cuenta')
        return
      }
      logout()
      navigate('/', { replace: true })
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setOpen(false)
    }
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card variant="outlined">
          <CardHeader title="Mi perfil" subheader="Datos de tu cuenta" />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Stack spacing={1}>
              <Typography><strong>Nombre:</strong> {user?.nombre || '-'}</Typography>
              <Typography><strong>Email:</strong> {user?.email || '-'}</Typography>
              <Typography><strong>Rol:</strong> {user?.rol || '-'}</Typography>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Button variant="text" onClick={() => navigate(-1)}>Volver</Button>
            <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
              Dar de baja mi cuenta
            </Button>
          </CardActions>
        </Card>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar baja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción eliminará tu cuenta y tus reservas asociadas. ¿Confirmás continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={darDeBaja}>Sí, eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
