import React, { useState } from 'react';
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import Grilla from './Grilla';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';

const horas = [
  '08:00','08:30', '09:00','09:30', '10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30', '14:00','14:30',
  '15:00','15:30', '16:00','16:30', '17:00','17:30', '18:00','18:30', '19:00','19:30', '20:00','20:30', '21:00','21:30',
  '22:00','22:30', '23:00','23:30', '24:00',
];

export default function FormularioConGrilla() {
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [nombre, setNombre] = useState('');
  const [cancha, setCancha] = useState('');
  const [reservas, setReservas] = useState([]);

  const hayConflicto = (nuevaReserva) => {
    return reservas.some((r) => {
      if (r.cancha !== nuevaReserva.cancha) return false;
      return (
        nuevaReserva.horaInicio < r.horaFin &&
        nuevaReserva.horaFin > r.horaInicio
      );
    });
  };

  const handleSubmit = () => {
    if (!horaInicio || !horaFin || !nombre || !cancha) {
      alert("⚠️ Completá todos los campos.");
      return;
    }

    if (horaInicio >= horaFin) {
      alert("⚠️ La hora de inicio debe ser menor que la de fin.");
      return;
    }

    const nuevaReserva = {
      horaInicio,
      horaFin,
      cancha,
      nombre
    };

    if (hayConflicto(nuevaReserva)) {
      alert("⚠️ Ya hay una reserva en esa cancha en el horario seleccionado.");
      return;
    }

    setReservas(prev => [...prev, nuevaReserva]);
    setHoraInicio('');
    setHoraFin('');
    setNombre('');
    setCancha('');
  };

  return (
    <Box sx={{ padding: 10 }}>
      <Typography level="h1" component="h1">Fecha Para ver reservas</Typography>
      <Input type='date' size='100' />

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Grilla reservas={reservas} />

        <Sheet
          sx={{
            width: 300,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
        >
          <Typography level="h1" component="h1">Reserva tu Turno</Typography>
          <Typography level="body-sm">Complete los campos para realizar una reserva.</Typography>

          <Select value={cancha} onChange={e => setCancha(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>Seleccionar cancha</MenuItem>
            {[...Array(8)].map((_, i) => (
              <MenuItem key={i} value={`cancha${i + 1}`}>Cancha {i + 1}</MenuItem>
            ))}
          </Select>

          <FormControl>
            <FormLabel>Hora inicio</FormLabel>
            <Select
              value={horaInicio}
              onChange={e => {
                setHoraInicio(e.target.value);
                setHoraFin('');
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>Seleccionar hora inicio</MenuItem>
              {horas.map(h => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Hora Fin</FormLabel>
            <Select
              value={horaFin}
              onChange={e => setHoraFin(e.target.value)}
              displayEmpty
              disabled={!horaInicio}
            >
              <MenuItem value="" disabled>Seleccionar hora fin</MenuItem>
              {horas.filter(h => h > horaInicio).map(h => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Nombre de reserva</FormLabel>
            <Input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </FormControl>

          <Button variant="contained" onClick={handleSubmit}>Reservar</Button>
        </Sheet>
      </Box>
    </Box>
  );
}