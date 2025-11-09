import React, { useState } from 'react'
import {
  Container, Card, CardHeader, CardContent, CardActions,
  Typography, Button, Stack, Divider, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Alert, Box
} from '@mui/material'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
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

      {/* 🔹 Fondo con imagen y desenfoque */}
      <Box
        sx={{
          position: 'relative',
          minHeight: 'calc(100vh - 64px)',
          backgroundImage:
            'url(https://cdn0.uncomo.com/es/posts/6/9/5/tipos_de_deportes_con_raqueta_52596_orig.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
        }}
      >
        {/* Capa de desenfoque */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255,255,255,0.25)',
            zIndex: 0,
          }}
        />

        {/* Contenido del perfil */}
        <Container
          maxWidth="sm"
          sx={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderRadius: 2,
            boxShadow: 4,
            py: 4,
            px: 3,
          }}
        >
          <Card
            variant="outlined"
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          >
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
      </Box>

      {/* ✅ Footer agregado */}
      <Footer />

      {/* Diálogo de confirmación */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar baja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción eliminará tu cuenta y tus reservas asociadas. ¿Confirmás continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={darDeBaja}>
            Sí, eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}