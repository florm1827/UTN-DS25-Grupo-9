import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListOpc from '../components/Nav';
import Box from '@mui/material/Box';
import Header from '../components/Header';
import FormularioConGrilla from '../components/Formulario';

export default function Home() {
  return (
    <Box sx={{
    boxShadow: 3,
    display: "flex",
    flexDirection: "column"
    }}>
    <Header></Header>
    <FormularioConGrilla></FormularioConGrilla>
    </Box>
  );
}
