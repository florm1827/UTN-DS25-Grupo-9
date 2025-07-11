import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';
import GoBack from '../components/Goback';

export default function App() {
  return (
    <CssVarsProvider>
            <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF0atdvUQ0jfi9D9EQpi_WDrh8Nmf1B0ogOQ&s)',
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
    Bienvenido!
  </Typography>
  <Typography level="body-sm">Registre su cuenta para continuar.</Typography>
</div>
<FormControl>
    <FormLabel>Nombre de usuario</FormLabel>
    <Input 
    name='nombre usuario'
    type="text"
    placeholder='juan01'
    />
</FormControl>
<FormControl>
    <FormLabel>Nombre Completo</FormLabel>
    <Input 
    name='nombre completo'
    type="text"
    placeholder='Juan Mariani'
    />
</FormControl>
<FormControl>
  <FormLabel>Email</FormLabel>
  <Input
    // html input attribute
    name="email"
    type="email"
    placeholder="xxxxx@gmail.com"
  />
</FormControl>
<FormControl>
  <FormLabel>Contraseña</FormLabel>
  <Input
    name="Contraseña"
    type="Contraseña"
    placeholder="Constraseña"
  />
</FormControl>
<FormControl>
  <FormLabel>Repetir contraseña</FormLabel>
  <Input
    name="repetir contraseña"
    type="Contraseña"
    placeholder="Constraseña"
  />
</FormControl>
<Button component={Link} to='/' sx={{ mt: 1 /* margin top */ }}>
  Registrarse
</Button>
</Sheet>
</div>
    </CssVarsProvider>
  );
}
