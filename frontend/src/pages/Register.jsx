import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <CssVarsProvider>
      <Sheet
  sx={{
    width: 300,
    mx: 'auto', // margin left & right
    my: 4, // margin top & bottom
    py: 3, // padding top & bottom
    px: 2, // padding left & right
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    borderRadius: 'sm',
    boxShadow: 'md',
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

    </CssVarsProvider>
  );
}
