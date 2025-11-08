import React from 'react'
import { Box, CircularProgress, Typography, Paper } from '@mui/material'

export default function FullscreenLoader({ text = 'Verificando sesión...' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'background.default',
        display: 'grid',
        placeItems: 'center',
        zIndex: 2000,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: 260,
        }}
      >
        <CircularProgress size={28} />
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Box>
  )
}
