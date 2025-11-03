import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Header() {
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()
  const [notiCount, setNotiCount] = React.useState(0)

  React.useEffect(() => {
    const fetchNotis = async () => {
      if (!token) {
        setNotiCount(0)
        return
      }
      try {
        const res = await fetch(`${API_URL}/reservas/mias`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!data.ok) {
          setNotiCount(0)
          return
        }
        const pendientes = data.reservas.filter(
          (r) => r.estado === 'PENDIENTE' || r.estado === 'RECHAZADA'
        )
        setNotiCount(pendientes.length)
      } catch {
        setNotiCount(0)
      }
    }
    fetchNotis()
  }, [token])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        enableColorOnDark
        sx={{
          boxShadow: 3,
          bgcolor: 'black',
          height: '75px',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            height: '75px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            position: 'relative',
          }}
        >
          {/* LOGO CENTRADO */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box
                component="img"
                src="https://ugc.production.linktr.ee/P1a4DyT5SuFn2KEQOn8g_eMxBK7O9Y71JdymF?io=true&size=avatar-v3_0"
                alt="Logo"
                sx={{
                  height: 60,
                  width: 60,
                  borderRadius: '50%',
                  marginTop: '3px',
                }}
              />
            </Link>
          </Box>

          {/* DERECHA */}
          <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto', alignItems: 'center' }}>
            {/* 🔔 notificaciones */}
            {user && (
              <Button
                color="inherit"
                onClick={() => navigate('/notificaciones')}
                sx={{ minWidth: 0 }}
              >
                <Badge badgeContent={notiCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </Button>
            )}

            {/* 👑 admin */}
            {user?.rol === 'ADMIN' && (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/admin')}
                >
                  Pendientes
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/admin/turnos')}
                >
                  Turnos
                </Button>
              </>
            )}

            {!user ? (
              <Button
                component={Link}
                to="/log"
                color="inherit"
                endIcon={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LoginIcon sx={{ fontSize: 50 }} />
                  </Box>
                }
              >
                Iniciar sesión
              </Button>
            ) : (
              <Button color="inherit" onClick={logout}>
                Cerrar sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
