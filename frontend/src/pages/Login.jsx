import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Link, useNavigate } from 'react-router-dom';

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
      // back
      navigate('/');
    }
  };

  return (
    <CssVarsProvider>
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
    </CssVarsProvider>
  );
}
