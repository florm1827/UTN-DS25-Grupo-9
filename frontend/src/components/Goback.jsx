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
        color="inherit"
        aria-label="volver"
        sx={{
          border: '1px solid white',
          padding: '6px',
          ml: 1,
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
    </ThemeProvider>
  );
}
