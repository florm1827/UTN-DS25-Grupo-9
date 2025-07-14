
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/AccountCircle';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        enableColorOnDark
        sx={{
          boxShadow: 3,
          bgcolor: 'black',
          height: '75px'
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
            position: 'relative'
          }}
        >
          {/* <Button component={Link} to="/reg" color="inherit">Registrarse</Button> */}
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
                  marginTop: '3px'
                }}
              />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, marginLeft:'auto' }}>
            <Button component={Link} to="/log" color="inherit" endIcon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LoginIcon sx={{ fontSize: 50 }} />
              </Box>
            }>Iniciar sesión</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
