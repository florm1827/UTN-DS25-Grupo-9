import React, { useEffect, useState } from 'react'
import {
  Container, Box, Card, CardHeader, CardContent, CardActions,
  Typography, Alert, TextField, MenuItem, Button, Stack, Chip,
  Divider, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, FormControlLabel, Checkbox,
  AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Header from '../components/Header.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const CANCHAS = ['cancha1','cancha2','cancha3','cancha4','cancha5','cancha6','cancha7','cancha8']

export default function AdminPage() {
  const { token, user } = useAuth()
  const [pendientes, setPendientes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().slice(0,10))
  const [canchaFiltro, setCanchaFiltro] = useState('')
  const [nombreFiltro, setNombreFiltro] = useState('')
  const [verTodas, setVerTodas] = useState(false)

  const [comentarios, setComentarios] = useState({})
  const [confirm, setConfirm] = useState({ open: false, id: null, action: null })

  const fetchPendientes = async () => {
    if (!token || user?.rol !== 'ADMIN') return
    setLoading(true); setError('')
    try {
      let url = `${API_URL}/reservas/pendientes`
      const q = []
      if (!verTodas && fechaFiltro) q.push(`fecha=${fechaFiltro}`)
      if (canchaFiltro) q.push(`cancha=${canchaFiltro}`)
      if (nombreFiltro) q.push(`nombre=${encodeURIComponent(nombreFiltro)}`)
      if (q.length) url += `?${q.join('&')}`

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!data.ok) return setError(data.msg || 'No se pudieron obtener las solicitudes')
      setPendientes(data.reservas)
    } catch {
      setError('Error de red')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchPendientes() }, [token, user, fechaFiltro, canchaFiltro, nombreFiltro, verTodas])

  const doAction = async () => {
    const { id, action } = confirm
    try {
      const res = await fetch(`${API_URL}/reservas/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comentario: comentarios[id] || '' })
      })
      const data = await res.json()
      if (!data.ok) setError(data.msg || 'No se pudo actualizar la reserva')
      setConfirm({ open: false, id: null, action: null })
      fetchPendientes()
    } catch { setError('Error de red') }
  }

  if (user?.rol !== 'ADMIN') {
    return (
      <>
        <Header />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">No tenés permisos para ver esta página.</Alert>
        </Container>
      </>
    )
  }

  return (
    <>
      <Header />

      {/* AppBar de filtros */}
      <AppBar position="sticky" color="default" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <FilterAltOutlinedIcon />
          <TextField
            label="Fecha"
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled={verTodas}
          />
          <TextField
            select size="small" label="Cancha"
            value={canchaFiltro} onChange={(e) => setCanchaFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {CANCHAS.map(c => <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>)}
          </TextField>
          <TextField
            size="small"
            label="Buscar por nombre"
            value={nombreFiltro}
            onChange={(e) => setNombreFiltro(e.target.value)}
            sx={{ minWidth: 220 }}
          />
          <FormControlLabel
            control={<Checkbox checked={verTodas} onChange={(e)=>setVerTodas(e.target.checked)} />}
            label="Ver todas"
          />
          <Tooltip title="Actualizar">
            <IconButton onClick={fetchPendientes}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="Solicitudes pendientes" subheader="Gestioná y comentá cada solicitud" />
          <CardContent>
            {error && <Alert sx={{ mb: 2 }} severity="error">{error}</Alert>}
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : pendientes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1">No hay solicitudes con esos filtros.</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {pendientes.map(r => (
                  <Card key={r.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                        <Box>
                          <Typography variant="h6">{r.cancha.toUpperCase()}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {r.fecha?.slice(0,10)} — {r.horaInicio} a {r.horaFin}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip label={`Solicitante: ${r.nombre}`} size="small" />
                            <Chip label={`Usuario: ${r.usuario?.nombre}`} size="small" variant="outlined" />
                            <Chip label={`Tipo: ${r.tipo}`} size="small" variant="outlined" />
                          </Stack>
                        </Box>
                        <TextField
                          label="Comentario del admin"
                          value={comentarios[r.id] || ''}
                          onChange={(e)=>setComentarios(prev=>({...prev,[r.id]:e.target.value}))}
                          multiline minRows={2} sx={{ flex: 1, minWidth: 260 }}
                        />
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button color="success" variant="contained"
                        onClick={()=>setConfirm({ open:true, id:r.id, action:'aceptar' })}>
                        Aceptar
                      </Button>
                      <Button color="error" variant="outlined"
                        onClick={()=>setConfirm({ open:true, id:r.id, action:'rechazar' })}>
                        Rechazar
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Dialog open={confirm.open} onClose={()=>setConfirm({ open:false, id:null, action:null })}>
          <DialogTitle>Confirmar acción</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirm.action === 'aceptar'
                ? '¿Confirmás aceptar esta solicitud? Se verificará que no haya solapamientos.'
                : '¿Confirmás rechazar esta solicitud?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setConfirm({ open:false, id:null, action:null })}>Cancelar</Button>
            <Button onClick={doAction} variant="contained">Confirmar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}
