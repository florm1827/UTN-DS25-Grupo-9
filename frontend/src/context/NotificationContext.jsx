import React, { createContext, useContext, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('info') // 'success' | 'error' | 'warning' | 'info'

  const showNotification = (msg, type = 'info') => {
    setMessage(msg)
    setSeverity(type)
    setOpen(true)
  }

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: '100%', fontSize: '1rem' }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
