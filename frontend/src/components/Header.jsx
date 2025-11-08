import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { Link, useNavigate } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LoginIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'

import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Header() {
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()

  // Notificaciones
  const [notiCount, setNotiCount] = React.useState(0)
  React.useEffect(() => {
    const fetchNotis = async () => {
      if (!token) return setNotiCount(0)
      try {
        const res = await fetch(`${API_URL}/reservas/mias`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!data.ok) return setNotiCount(0)
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

  // Menú desplegable
  const [anchorEl, setAnchorEl] = React.useState(null)
  const menuOpen = Boolean(anchorEl)
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const go = (path) => {
    handleMenuClose()
    navigate(path)
  }

  const doLogout = () => {
    handleMenuClose()
    logout()
    navigate('/')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        enableColorOnDark
        sx={{ boxShadow: 3, bgcolor: 'black', height: '75px' }}
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
                sx={{ height: 60, width: 60, borderRadius: '50%', mt: '3px' }}
              />
            </Link>
          </Box>

          {/* DERECHA */}
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto', alignItems: 'center' }}>
            {/* 👑 admin */}
            {user?.rol === 'ADMIN' && (
              <>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/admin')}>
                  Pendientes
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/admin/turnos')}>
                  Turnos
                </Button>
              </>
            )}

            {/* 🔐 login / menú usuario */}
            {!user ? (
              <Button
                component={Link}
                to="/log"
                color="inherit"
                endIcon={<LoginIcon sx={{ fontSize: 32 }} />}
              >
                Iniciar sesión
              </Button>
            ) : (
              <>
                {/* ICONO PERFIL + MENÚ */}
                <Tooltip title="Menú de usuario">
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    aria-controls={menuOpen ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                  >
                    <AccountCircleOutlinedIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Tooltip>

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1,
                      minWidth: 230,
                      overflow: 'visible',
                      '& .MuiMenuItem-root': { py: 1 },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* 🧑 encabezado con nombre y rol */}
                  <Box sx={{ px: 2, py: 1.2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.rol}
                    </Typography>
                  </Box>
                  <Divider />

                  <MenuItem onClick={() => go('/perfil')}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Perfil
                  </MenuItem>

                  <MenuItem onClick={() => go('/notificaciones')}>
                    <ListItemIcon>
                      <Badge badgeContent={notiCount} color="error">
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    Notificaciones
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={doLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
