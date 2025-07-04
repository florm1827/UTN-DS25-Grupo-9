import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListOpc from './assets/components/Nav';
import Box from '@mui/material/Box';
import Header from './assets/components/Header';

export default function BasicButtons() {
  return (
    <Box sx={{
    boxShadow: 3,
    display: "flex",
    flexDirection: "column"
    }}>
    <Header></Header>
    <ListOpc></ListOpc>
    </Box>
  );
}
