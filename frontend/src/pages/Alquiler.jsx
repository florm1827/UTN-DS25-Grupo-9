import * as React from 'react';
import Box from '@mui/material/Box';
import Header from '../components/Header';
import FormularioConGrilla from '../components/Formulario';
import Footer from '../components/Footer.jsx';

export default function Home() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden', 
      }}
    >
      {/* Imagen de fondo difuminada */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSULDaq8_cbAxm7p1FNOnLZfrC4CETilg_IA2AtuA2kVYy2VsmyzQufXMmlzEBpCPrd9Ok&usqp=CAU)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />

      {/* Header */}
      <Header />

      {/* Contenedor vidrioso */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: 4,
          zIndex: 1,
          px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {/* Contenedor interno del formulario */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '95%', sm: 1600 }, 
            height: 'auto',
            m: '0 auto',
          }}
        >
          <FormularioConGrilla />
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}