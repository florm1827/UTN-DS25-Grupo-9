import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import { Link, useNavigate } from 'react-router-dom'
import GoBack from '../components/Goback'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errors, setErrors] = React.useState({})
  const [serverError, setServerError] = React.useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const validar = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'El correo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Correo inválido.'
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.'
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validar()) return

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setServerError(data.msg || 'Credenciales inválidas')
        return
      }

      // guardar en contexto
      login(data)
      navigate('/')
    } catch (err) {
      setServerError('No se pudo conectar con el servidor')
    }
  }

  return (
    <CssVarsProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundImage:
            'url(https://cdn0.uncomo.com/es/posts/6/9/5/tipos_de_deportes_con_raqueta_52596_orig.jpg)',
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
            py: 3,
            px: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
            zIndex: 1,
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(255,255,255,0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Typography level="h1" component="h1">
            ¡Bienvenido!
          </Typography>
          <Typography level="body-sm">
            Inicia sesión para continuar.
          </Typography>

          <FormControl error={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="xxxxx@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <Typography level="body-xs" color="danger">
                {errors.email}
              </Typography>
            )}
          </FormControl>

          <FormControl error={!!errors.password}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <Typography level="body-xs" color="danger">
                {errors.password}
              </Typography>
            )}
          </FormControl>

          <Button onClick={handleLogin} sx={{ mt: 1 }}>
            Iniciar sesión
          </Button>

          {serverError && (
            <Typography level="body-sm" color="danger">
              {serverError}
            </Typography>
          )}

          <Typography
            endDecorator={<Link to="/reg">Regístrate</Link>}
            fontSize="sm"
            sx={{ alignSelf: 'center' }}
          >
            ¿No tienes cuenta?
          </Typography>
        </Sheet>
      </div>
    </CssVarsProvider>
  )
}
