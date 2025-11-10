// src/components/Grilla.jsx
import React, { useMemo } from 'react'
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Tooltip, Chip, Stack, Divider
} from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

const CANCHAS = ['cancha1','cancha2','cancha3','cancha4','cancha5','cancha6','cancha7','cancha8']

// 🎨 Colores suaves y sus equivalentes de texto
const TIPO_BG = {
  RESERVA: '#e3f2fd',        // celeste muy suave
  TURNO_FIJO: '#ede7f6',     // violeta muy suave
  CLASE: '#e8f5e9',          // verde muy suave
  ESCUELA: '#fff3e0',        // naranja muy suave
  TORNEO: '#ffebee',         // rojo muy suave
  MANTENIMIENTO: '#eeeeee',  // gris claro
}

const TIPO_FG = {
  RESERVA: '#0d47a1',
  TURNO_FIJO: '#4a148c',
  CLASE: '#1b5e20',
  ESCUELA: '#e65100',
  TORNEO: '#b71c1c',
  MANTENIMIENTO: '#424242',
}

const genSlots = () => {
  const slots = []
  for (let h = 8; h <= 22; h++) {
    const hh = String(h).padStart(2, '0')
    slots.push(`${hh}:00`)
    if (h !== 22) slots.push(`${hh}:30`)
  }
  return slots
}
const SLOTS = genSlots()

const slotOcupado = (slot, inicio, fin) => slot >= inicio && slot < fin

export default function Grilla({ reservas = [], fecha }) {
  const { user } = useAuth()
  const isAdmin = user?.rol === 'ADMIN'

  const reservasPorCancha = useMemo(() => {
    const map = new Map()
    for (const c of CANCHAS) map.set(c, [])
    for (const r of reservas) {
      if (!map.has(r.cancha)) map.set(r.cancha, [])
      map.get(r.cancha).push(r)
    }
    for (const c of CANCHAS) map.get(c)?.sort((a,b)=>a.horaInicio.localeCompare(b.horaInicio))
    return map
  }, [reservas])

  return (
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Disponibilidad — {fecha}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" label="Reserva" sx={{ bgcolor: '#e3f2fd' }} />
          <Chip size="small" label="Turno fijo" sx={{ bgcolor: '#ede7f6' }} />
          <Chip size="small" label="Clase" sx={{ bgcolor: '#e8f5e9' }} />
          <Chip size="small" label="Escuela" sx={{ bgcolor: '#fff3e0' }} />
          <Chip size="small" label="Torneo" sx={{ bgcolor: '#ffebee' }} />
          <Chip size="small" label="Mantenimiento" sx={{ bgcolor: '#eeeeee' }} />
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper', minWidth: 80, fontWeight: 600 }}>Hora</TableCell>
              {CANCHAS.map((c) => (
                <TableCell key={c} align="center" sx={{ fontWeight: 600, whiteSpace: 'nowrap', minWidth: 110, textTransform: 'uppercase' }}>
                  {c}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {SLOTS.map((slot) => (
              <TableRow key={slot} hover>
                <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1, bgcolor: 'background.paper', fontWeight: 500 }}>
                  {slot}
                </TableCell>

                {CANCHAS.map((cancha) => {
                  const lista = reservasPorCancha.get(cancha) || []
                  const r = lista.find((res) => slotOcupado(slot, res.horaInicio, res.horaFin))
                  const ocupado = Boolean(r)

                  if (!ocupado) {
                    return (
                      <TableCell key={cancha + slot} align="center" sx={{ p: 0.5 }}>
                        <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 1, height: 28 }} />
                      </TableCell>
                    )
                  }

                  const bg = TIPO_BG[r.tipo] || '#f5f5f5'
                  const fg = TIPO_FG[r.tipo] || '#000'
                  const textColor = isAdmin ? fg : fg
                  const contentForAdmin = `${r?.nombre ?? '-'}`

                  return (
                    <TableCell key={cancha + slot} align="center" sx={{ p: 0.5 }}>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="caption">{r.horaInicio}–{r.horaFin} • {cancha.toUpperCase()}</Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>{r.tipo}</Typography>
                            {r.nombre && <Typography variant="caption" color="text.secondary">{r.nombre}</Typography>}
                          </Box>
                        }
                        arrow
                      >
                        <Box
                          sx={{
                            bgcolor: bg,
                            color: textColor,
                            borderRadius: 1,
                            height: 28,
                            lineHeight: '28px',
                            fontSize: 12,
                            fontWeight: 700,
                            px: 0.75,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isAdmin ? contentForAdmin : r.tipo.replace('_', ' ')}
                        </Box>
                      </Tooltip>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {(!reservas || reservas.length === 0) && (
        <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">No hay reservas aceptadas para este día todavía.</Typography>
        </Box>
      )}
    </Paper>
  )
}
