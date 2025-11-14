
import React, { useEffect, useState } from 'react'
import {
  Container, Box, Card, CardHeader, CardContent, CardActions, Typography,
  TextField, MenuItem, Button, Stack, Chip, Divider, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const CANCHAS = ['cancha1','cancha2','cancha3','cancha4','cancha5','cancha6','cancha7','cancha8']
const TIPOS_ADMIN = ['RESERVA','TURNO_FIJO','CLASE','ESCUELA','TORNEO','MANTENIMIENTO']
const HORAS = (() => { const h=[]; for(let i=8;i<=22;i++){const hh=String(i).padStart(2,'0'); h.push(`${hh}:00`); if(i!==22) h.push(`${hh}:30`)} return h })()

export default function AdminTurnos() {
  const { token, user } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [fecha, setFecha] = useState('')
  const [cancha, setCancha] = useState('')
  const [nombre, setNombre] = useState('')

  const [editId, setEditId] = useState(null)
  const [formEdit, setFormEdit] = useState({})
  const [confirmBaja, setConfirmBaja] = useState({ open:false, id:null })

  const cargar = async () => {
    if (!token || user?.rol !== 'ADMIN') return
    setLoading(true); setError('')
    try {
      let url = `${API_URL}/reservas/admin/aceptadas`
      const q = []
      if (fecha) q.push(`fecha=${fecha}`)
      if (cancha) q.push(`cancha=${cancha}`)
      if (nombre) q.push(`nombre=${encodeURIComponent(nombre)}`)
      if (q.length) url += `?${q.join('&')}`
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'No se pudieron obtener las reservas')
      setTurnos(data.reservas)
    } catch { setError('Error de red') }
    finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [token, user, fecha, cancha, nombre])

  const startEdit = (t) => {
    setEditId(t.id)
    setFormEdit({
      cancha: t.cancha,
      fecha: t.fecha?.slice(0,10),
      horaInicio: t.horaInicio,
      horaFin: t.horaFin,
      nombre: t.nombre,
      comentario: t.comentario || '',
      tipo: t.tipo || 'RESERVA',
    })
  }
  const cancelEdit = () => { setEditId(null); setFormEdit({}) }

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reservas/${id}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formEdit)
      })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'No se pudo actualizar el turno')
      setEditId(null); cargar()
    } catch { setError('Error de red') }
  }

  const baja = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reservas/${id}/baja`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comentario: 'Baja realizada por administrador' })
      })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'No se pudo dar de baja el turno')
      setConfirmBaja({ open:false, id:null }); cargar()
    } catch { setError('Error de red') }
  }

  if (user?.rol !== 'ADMIN') {
    return (
      <>
        <Header />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">No tenés permisos para ver esta página.</Alert>
        </Container>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      {/* Fondo con imagen y efecto difuminado */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7itHBTJLvEZ9yP0jyH3rgrIJN5DDHFhXxgUTAQ7a7pQD1t42EfsB6_9AfM_a0ZD9D9I&usqp=CAU)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Capa de desenfoque */}
        <Box
          sx={{
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

        {/* Contenido principal */}
        <Box sx={{ position: 'relative', zIndex: 1, pb: 8  }}>
          <AppBar
            position="sticky"
            color="default"
            sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'rgba(255,255,255,0.8)' }}
          >
            <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
              <TextField label="Fecha" type="date" size="small"
                value={fecha} onChange={(e)=>setFecha(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField select label="Cancha" size="small" sx={{ minWidth: 150 }}
                value={cancha} onChange={(e)=>setCancha(e.target.value)}>
                <MenuItem value="">Todas</MenuItem>
                {CANCHAS.map(c => <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>)}
              </TextField>
              <TextField label="Buscar por nombre" size="small"
                value={nombre} onChange={(e)=>setNombre(e.target.value)} />
              <Tooltip title="Actualizar">
                <IconButton onClick={cargar}><RefreshIcon /></IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 2, mt: 2 }}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardHeader title="Turnos aceptados" subheader="Filtrá, editá o da de baja turnos" />
              <CardContent>
                {error && <Alert sx={{ mb: 2 }} severity="error">{error}</Alert>}
                <Divider sx={{ mb: 2 }} />
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                  </Box>
                ) : turnos.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography>No hay turnos aceptados con esos filtros.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {turnos.map(t => (
                      <Card key={t.id} variant="outlined">
                        <CardContent>
                          {editId === t.id ? (
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={2} flexWrap="wrap">
                                <TextField select label="Cancha" size="small" sx={{ minWidth: 150 }}
                                  value={formEdit.cancha} onChange={(e)=>setFormEdit(f=>({...f, cancha:e.target.value}))}>
                                  {CANCHAS.map(c => <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>)}
                                </TextField>
                                <TextField label="Fecha" type="date" size="small"
                                  value={formEdit.fecha} onChange={(e)=>setFormEdit(f=>({...f, fecha:e.target.value}))}
                                  InputLabelProps={{ shrink: true }} />
                                <TextField select label="Hora inicio" size="small" sx={{ minWidth: 120 }}
                                  value={formEdit.horaInicio} onChange={(e)=>setFormEdit(f=>({...f, horaInicio:e.target.value}))}>
                                  {HORAS.map(h=> <MenuItem key={h} value={h}>{h}</MenuItem>)}
                                </TextField>
                                <TextField select label="Hora fin" size="small" sx={{ minWidth: 120 }}
                                  value={formEdit.horaFin} onChange={(e)=>setFormEdit(f=>({...f, horaFin:e.target.value}))}>
                                  {HORAS.map(h=> <MenuItem key={h} value={h}>{h}</MenuItem>)}
                                </TextField>
                                <TextField label="Nombre reserva" size="small" sx={{ minWidth: 220 }}
                                  value={formEdit.nombre} onChange={(e)=>setFormEdit(f=>({...f, nombre:e.target.value}))}/>
                                <TextField select label="Tipo" size="small" sx={{ minWidth: 160 }}
                                  value={formEdit.tipo} onChange={(e)=>setFormEdit(f=>({...f, tipo:e.target.value}))}>
                                  {TIPOS_ADMIN.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                                </TextField>
                              </Stack>
                              <TextField label="Comentario" multiline minRows={2}
                                value={formEdit.comentario} onChange={(e)=>setFormEdit(f=>({...f, comentario:e.target.value}))}/>
                            </Stack>
                          ) : (
                            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                              <Box>
                                <Typography variant="h6">{t.cancha.toUpperCase()}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {t.fecha?.slice(0,10)} — {t.horaInicio} a {t.horaFin}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                  <Chip label={`Nombre reserva: ${t.nombre}`} size="small" />
                                  <Chip label={`Usuario: ${t.usuario?.nombre}`} size="small" variant="outlined" />
                                  <Chip label={`Tipo: ${t.tipo}`} size="small" variant="outlined" />
                                </Stack>
                                {t.comentario && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Comentario: {t.comentario}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                          {editId === t.id ? (
                            <>
                              <Button variant="contained" onClick={()=>saveEdit(t.id)}>Guardar</Button>
                              <Button onClick={cancelEdit}>Cancelar</Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outlined" onClick={()=>startEdit(t)}>Modificar</Button>
                              <Button color="error" variant="outlined"
                                onClick={()=>setConfirmBaja({ open:true, id:t.id })}>
                                Dar de baja
                              </Button>
                            </>
                          )}
                        </CardActions>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Dialog open={confirmBaja.open} onClose={()=>setConfirmBaja({ open:false, id:null })}>
              <DialogTitle>Dar de baja turno</DialogTitle>
              <DialogContent>
                <DialogContentText>¿Confirmás dar de baja este turno aceptado?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>setConfirmBaja({ open:false, id:null })}>Cancelar</Button>
                <Button color="error" variant="contained" onClick={()=>baja(confirmBaja.id)}>Confirmar</Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>

      <Footer />
    </>
  )
}