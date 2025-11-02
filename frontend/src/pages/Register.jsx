import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import GoBack from '../components/Goback'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Register() {
  const [nombre, setNombre] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [repassword, setRepassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!nombre || !email || !password || !repassword) {
      setError('Completá todos los campos')
      return
    }

    if (password !== repassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setError(data.msg || 'No se pudo registrar')
        return
      }

      // guardamos la sesión que devuelve el backend
      login(data)
      navigate('/')
    } catch (err) {
      setError('Error de conexión con el servidor')
    }
  }

  return (
    <CssVarsProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundImage:
            'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF0atdvUQ0jfi9D9EQpi_WDrh8Nmf1B0ogOQ&s)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
          <GoBack />
        </div>
        <Sheet
          sx={{
            width: 300,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
            zIndex: 1,
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
        >
          <div>
            <Typography level="h1" component="h1">
              ¡Bienvenido!
            </Typography>
            <Typography level="body-sm">
              Registre su cuenta para continuar.
            </Typography>
          </div>

          <FormControl>
            <FormLabel>Nombre Completo</FormLabel>
            <Input
              name="nombre"
              type="text"
              placeholder="Juan Mariani"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="xxxxx@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Repetir contraseña</FormLabel>
            <Input
              name="repassword"
              type="password"
              placeholder="Contraseña"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
            />
          </FormControl>

          <Button onClick={handleRegister} sx={{ mt: 1 }}>
            Registrarse
          </Button>

          {error && (
            <Typography level="body-sm" color="danger">
              {error}
            </Typography>
          )}
        </Sheet>
      </div>
    </CssVarsProvider>
  )
}
