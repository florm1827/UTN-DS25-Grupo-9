
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Link, useNavigate } from 'react-router-dom';
import GoBack from '../components/Goback';

export default function App() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();

  const validar = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Correo inválido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validar()) {
      navigate('/');
    }
  };

  return (
    <CssVarsProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'url(https://cdn0.uncomo.com/es/posts/6/9/5/tipos_de_deportes_con_raqueta_52596_orig.jpg)',
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
            top: 0, left: 0, right: 0, bottom: 0,
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
          }}
        >
          <Typography level="h1" component="h1">¡Bienvenido!</Typography>
          <Typography level="body-sm">Inicia sesión para continuar.</Typography>

          <FormControl error={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="xxxxx@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <Typography level="body-xs" color="danger">{errors.email}</Typography>}
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
            {errors.password && <Typography level="body-xs" color="danger">{errors.password}</Typography>}
          </FormControl>

          <Button onClick={handleLogin} sx={{ mt: 1 }}>
            Iniciar sesión
          </Button>

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
  );
}
