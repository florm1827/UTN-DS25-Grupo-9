import React, { useState } from 'react';
import { Box, Button, Input, MenuItem, Select } from '@mui/material';
import Grilla from './Grilla';

export default function FormularioConGrilla() {
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [nombre, setNombre] = useState('');
  const [cancha, setCancha] = useState('');
  const [reservas, setReservas] = useState([]);

  // ✅ Función que detecta si hay superposición
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

    // ✅ Agrega la reserva si todo está bien
    setReservas(prev => [...prev, nuevaReserva]);

    // Limpiar campos
    setHoraInicio('');
    setHoraFin('');
    setNombre('');
    setCancha('');
  };

  return (
    <>
    <h1>Selecciona Fecha Para ver reservas</h1>
    <Input type='date'> </Input>
    <Box sx={{display:"flex", flexDirection:"row", gap:2}}>
              <Grilla reservas={reservas} />
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Select value={cancha} onChange={e => setCancha(e.target.value)} displayEmpty>
        <MenuItem value="" disabled>Seleccionar cancha</MenuItem>
        {[...Array(8)].map((_, i) => (
          <MenuItem key={i} value={`cancha${i + 1}`}>Cancha {i + 1}</MenuItem>
        ))}
      </Select>

      Hora Inicio
      <Input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />

      Hora Fin
      <Input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />

      Nombre de la reserva
      <Input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />

      <Button variant="contained" onClick={handleSubmit}>Reservar</Button>
    </Box>
    </Box>
    </>
  );
}
