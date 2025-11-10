import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import GoBack from '../components/Goback';

export default function Nosotros() {
  return (
    <CssVarsProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundImage:
            'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi9FaBHq4Gx59FHbOo4fwjZp-t5_JA_MeLlg&s)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '10px',
        }}
      >
        {/* Capa difuminada de fondo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            zIndex: 0,
          }}
        />

        {/* Botón de volver */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
          <GoBack />
        </div>

        {/* Recuadro principal ocupando casi toda la página */}
        <Sheet
          sx={{
            width: { xs: '95%', sm: '95%', md: '90%' },
            height: { xs: '90%', sm: '90%', md: '85%' }, // 👈 altura grande
            py: 5,
            px: 5,
            borderRadius: 'md',
            boxShadow: 'xl',
            zIndex: 1,
            overflowY: 'auto', // 👈 permite scroll si hay mucha info
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
          }}
        >
          <Typography
            level="h1"
            component="h1"
            sx={{ mb: 3, fontWeight: 'bold', fontSize: '2rem' }}
          >
            Sobre nosotros
          </Typography>

          <Typography
            level="body-md"
            sx={{ textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7 }}
          >
 El Hipódromo Club de Tenis es un club dedicado principalmente al tenis,
 con instalaciones que incluyen canchas y espacios para la práctica de este deporte.
 Abierto todos los días de 08:00 a 22:00, ofrece horarios amplios para socios y visitantes.
          </Typography>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
}
