import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListOpc from '../components/Nav';
import Box from '@mui/material/Box';
import Header from '../components/Header';
import Grilla from '../components/Grilla';

export default function Home() {
  return (
    <Box sx={{
    boxShadow: 3,
    display: "flex",
    flexDirection: "column"
    }}>
    <Header></Header>
    <Grilla></Grilla>
    </Box>
  );
}
