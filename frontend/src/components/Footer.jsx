 import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'black',
        color: 'white',
        py: 4,
        px: 4,
        mt: 'auto',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box sx={{ minWidth: 250, maxWidth: 300, mb: { xs: 3, md: 0 } }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              mb: 2,
              textAlign: { xs: 'left', md: 'left' },
            }}
          >
            Contáctanos
          </Typography>
          <Stack spacing={1} sx={{ pl: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" />
              <Link href="mailto:correo@ejemplo.com" underline="hover" color="inherit">
                correo@ejemplo.com
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" />
              <Link href="tel:+541112345678" underline="hover" color="inherit">
                +54 11 1234 5678
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InstagramIcon fontSize="small" />
              <Link
                href="https://www.instagram.com/hipodromoclubdetenis/"
                target="_blank"
                rel="noopener"
                underline="hover"
                color="inherit"
              >
                @hipodromoclubdetenis
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FacebookIcon fontSize="small" />
              <Link
                href="https://www.facebook.com/tenislaplata"
                target="_blank"
                rel="noopener"
                underline="hover"
                color="inherit"
              >
                facebook.com/tenislaplata
              </Link>
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 3, md: 0 },
            marginLeft: '45px',
          }}
        >
          <Box
            component="img"
            src="https://ugc.production.linktr.ee/P1a4DyT5SuFn2KEQOn8g_eMxBK7O9Y71JdymF?io=true&size=avatar-v3_0"
            alt="Logo central"
            sx={{ height: 150, width: 150, borderRadius: '50%',}}
          />
        </Box>
        <Box sx={{ minWidth: 250, maxWidth: 300 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOnIcon fontSize="small" />
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              Dónde nos encontramos
            </Typography>
          </Box>
          <Typography variant="body1">
            Av. 44, C. 115 y, B1900 La Plata, Provincia de Buenos Aires, Argentina
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
