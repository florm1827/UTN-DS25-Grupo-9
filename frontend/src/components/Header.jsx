import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky"
              enableColorOnDark
              sx={{
                boxShadow: 3,
                bgcolor: 'black',
                height: '75px'
              }}>
        <Toolbar
          disableGutters
          sx={{
            height: '75px',
            display: 'flex',
            alignItems: 'center',
            paddingX: 2,
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box
              component="img"
              src="https://ugc.production.linktr.ee/P1a4DyT5SuFn2KEQOn8g_eMxBK7O9Y71JdymF?io=true&size=avatar-v3_0"
              alt="Logo"
              sx={{
                height: 60,
                width: 60,
                mr: 2,
                borderRadius: '50%',
              }}
            />
          </Link>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button variant="outlined"  size='xl' component={Link} to='/' color='inherit' startIcon={<HomeIcon />}>
              Volver inicio
            </Button>
          </Typography>
          <Button component={Link} to='/log' color="inherit">Iniciar sesion</Button>
          <Button component={Link} to='/' color="inherit">Registrarse</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
