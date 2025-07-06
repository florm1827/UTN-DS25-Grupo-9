import React, { useState } from 'react';
import { Box, Button, FormControl, Input, MenuItem, Select } from '@mui/material';
import Grilla from './Grilla';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

export default function FormularioConGrilla() {
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [nombre, setNombre] = useState('');
  const [cancha, setCancha] = useState('');
  const [reservas, setReservas] = useState([]);

  const hayConflicto = (nuevaReserva) => {
    return reservas.some((r) => {
      if (r.cancha !== nuevaReserva.cancha) return false;

      // Verifica si hay solapamiento de horarios
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
    <>
    <Typography level="h1" component="h1">Fecha Para ver reservas</Typography>
    <Input type='date'> </Input>
    <Box sx={{display:"flex", flexDirection:"row", gap:2}}>
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
        <Input
        name="horainicio"
        type="time"
        step="1800"
        min="08:00"
        max="23:59"
        value={horaInicio} onChange={e => setHoraInicio(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Hora Fin</FormLabel>
        <Input
        name="horafin"
        type="time"
        step="1800"
        min="08:00"
        max="23:59"
        value={horaFin} onChange={e => setHoraFin(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Nombre de reserva</FormLabel>
        <Input
        name="horafin"
        type="text"
        value={nombre} onChange={e => setNombre(e.target.value)}
        />
      </FormControl>
      <Button variant="contained" onClick={handleSubmit}>Reservar</Button>
    </Sheet>
    </Box>
    </>
  );
}
