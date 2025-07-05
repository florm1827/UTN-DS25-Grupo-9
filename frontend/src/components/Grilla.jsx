import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const horas = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'
];

const canchas = [
  'cancha1', 'cancha2', 'cancha3', 'cancha4',
  'cancha5', 'cancha6', 'cancha7', 'cancha8'
];

// 🔴 Estilo para celdas reservadas
const ReservedCell = styled('div')({
  backgroundColor: '#f44336',
  color: '#fff',
  fontWeight: 'bold',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// 🔁 Generador de filas basado en las reservas que se pasan por props
function generarFilasConReservas(reservas) {
  return horas.map((hora, idx) => {
    const row = { id: idx, hora };

    canchas.forEach((cancha) => {
      const reserva = reservas.find(r => (
        r.cancha === cancha &&
        hora >= r.horaInicio &&
        hora < r.horaFin
      ));

      if (reserva) {
        row[cancha] = {
          nombre: reserva.nombre,
          reservado: true
        };
      } else {
        row[cancha] = {
          nombre: '',
          reservado: false
        };
      }
    });

    return row;
  });
}

// 🔧 Columnas con renderizado condicional para celdas reservadas
const columns = [
  {
    field: 'hora',
    headerName: 'Hora',
    width: 90,
    sortable: false,
  },
  ...canchas.map(cancha => ({
    field: cancha,
    headerName: cancha.toUpperCase(),
    width: 150,
    sortable: false,
    renderCell: (params) => {
      if (params.value?.reservado) {
        return <ReservedCell>{params.value.nombre}</ReservedCell>;
      }
      return '';
    }
  }))
];

export default function DataGridDemo({ reservas }) {
  const rows = generarFilasConReservas(reservas);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth: 1350 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          autoHeight
        />
      </Box>
    </Box>
  );
}
