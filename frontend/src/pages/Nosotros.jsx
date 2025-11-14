import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
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
          fontFamily: '"Segoe UI", Tahoma, sans-serif',
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

        {/* ocupa casi toda la página */}
        <Sheet
          sx={{
            width: { xs: '95%', sm: '60%', md: '50%' },
            height: { xs: '90%', sm: '90%', md: '85%' },
            py: 5,
            px: 5,
            borderRadius: 'md',
            boxShadow: 'xl',
            zIndex: 1,
            overflowY: 'auto',
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
            sx={{ textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7, mb: 2 }}
          >
            En Hipódromo Club de Tenis creemos en el potencial de este deporte, tanto para mejorar uno mismo como para conectar con otros.
          </Typography>

          <Typography
            level="body-md"
            sx={{ textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7, mb: 2 }}
          >
            Desde nuestros inicios, hace casi 90 años, fuimos un punto de encuentro para jugadores de todas las edades y niveles, y proporcionamos lo necesario para que cualquiera pueda aprender y jugar.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1, mr: { md: 2 }, mb: { xs: 2, md: 0 } }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgE9gnQnvakfYwmqVtNpzaoZDhw2k86ro1S4jICRlLITfyiE_bIVYXj71bcB9FyItsAhk&usqp=CAU"
                alt="Clases"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
            <Typography
              level="body-md"
              sx={{ flex: 2, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7 }}
            >
              Vimos surgir amistades y grandes jugadores, y esto se debe a nuestra amplia oferta de clases, que permite que todos puedan jugar e ir mejorando constantemente. Contamos con una escuela propia para los más chicos, pero también para los mayores, llevando un seguimiento de su nivel para que siempre sigan progresando. Además, contamos con una gran variedad de profesores si tu preferencia son las clases particulares, muchos de ellos con una amplia trayectoria y muchos años de experiencia tanto en la práctica del deporte como en la docencia del mismo.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              level="body-md"
              sx={{ flex: 2, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7, mb: { xs: 2, md: 0 } }}
            >
              En cuanto a nuestras instalaciones, contamos con 8 canchas de polvo de ladrillo, 5 de ellas con luces LED, por lo que pueden utilizarse también al caer el sol. Contamos también con amplios vestuarios completamente equipados y un buffet.
            </Typography>
            <Box sx={{ flex: 1, ml: { md: 2 } }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO4XZqYWmJHFRt_JvCKx0xD33n_4_1p0zcLg&s"
                alt="Instalaciones"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1, mr: { md: 2 }, mb: { xs: 2, md: 0 } }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmoxIfonZ2YlzkpQQt74WTbL_ptu81WaCNbw&s"
                alt="Hugo Suárez"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
            <Typography
              level="body-md"
              sx={{ flex: 2, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7 }}
            >
              Nuestro club se encuentra a cargo de Hugo Suárez, un respetado profesor con décadas de experiencia en la docencia del deporte y una amplia trayectoria como profesional, habiendo jugado en el primer circuito de Francia y compitiendo actualmente como veterano en Argentina, donde ha ganado el campeonato argentino seniors en múltiples ocasiones.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
            }}
          >
            <Typography
              level="body-md"
              sx={{ flex: 2, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.7, mb: { xs: 2, md: 0 } }}
            >
              En nuestro club vimos a varios jugadores llegar a ser profesionales, pero el más destacado de todos ha sido Tomás Martín Etcheverry, a quien tuvimos el privilegio de ver entrenar en sus primeros años de formación. Hoy es un grandísimo jugador, con logros tan impresionantes como haber logrado estar entre los 30 mejores tenistas del mundo.
            </Typography>
            <Box sx={{ flex: 1, ml: { md: 2 } }}>
              <img
                src="https://www.lanacion.com.ar/resizer/v2/tomas-etcheverry-consiguio-un-muy-buen-triunfo-VMMZODMACND5LBPCTORR5KFBTQ.jpg?auth=bbae39fefe8357c0253a825639aba3814feb524403ecd60e71ddad6f72516455&width=880&height=586&quality=70&smart=true"
                alt="Tomás Etcheverry"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          </Box>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
}
