import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const horas = [
  '08:00','08:30', '09:00','09:30', '10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30', '14:00','14:30',
  '15:00','15:30', '16:00','16:30', '17:00','17:30', '18:00','18:30', '19:00','19:30', '20:00','20:30', '21:00','21:30',
  '22:00','22:30', '23:00','23:30', '24:00',
];

const canchas = [
  'cancha1', 'cancha2', 'cancha3', 'cancha4',
  'cancha5', 'cancha6', 'cancha7', 'cancha8'
];

// 🔴 Celda reservada (estilo rojo con nombre)
const ReservedCell = styled('div')({
  backgroundColor: '#e53935',
  color: '#fff',
  fontWeight: 'bold',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
});

// 🔄 Generar filas en función de las reservas
function generarFilasConReservas(reservas = []) {
  return horas.map((hora, idx) => {
    const row = { id: idx, hora };

    canchas.forEach((cancha) => {
      const reserva = reservas.find(
        (r) => r.cancha === cancha && hora >= r.horaInicio && hora < r.horaFin
      );

      row[cancha] = reserva
        ? { nombre: reserva.nombre, reservado: true }
        : { nombre: '', reservado: false };
    });

    return row;
  });
}

export default function Grilla({ reservas = [] }) {
  const rows = generarFilasConReservas(reservas);

  const columns = [
    {
      field: 'hora',
      headerName: 'Hora',
      width: 90,
      sortable: false,
    },
    ...canchas.map((cancha) => ({
      field: cancha,
      headerName: cancha.toUpperCase(),
      width: 130,
      sortable: false,
      renderCell: (params) =>
        params.value?.reservado ? (
          <ReservedCell>{params.value.nombre}</ReservedCell>
        ) : (
          ''
        ),
    })),
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'auto',
        mt: 4,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          disableColumnMenu
          autoHeight
          sx={{
            backgroundColor: '#fafafa',
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
      </Box>
    </Box>
  );
}
