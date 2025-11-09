
import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const materialTheme = createTheme();

export default function GoBack() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={materialTheme}>
      <IconButton
        onClick={() => navigate(-1)}
        size="small"
        aria-label="volver"
        sx={{
          backgroundColor: 'white', // fondo blanco
          color: 'black',           // color del ícono
          padding: '6px',
          ml: 1,
          '&:hover': {
            backgroundColor: '#f0f0f0', // ligero cambio de color al hacer hover
          },
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
    </ThemeProvider>
  );
}
