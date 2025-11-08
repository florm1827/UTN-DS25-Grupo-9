import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import FullscreenLoader from './FullscreenLoader.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Mientras AuthContext verifica token/usuario → mostrar spinner
  if (loading) return <FullscreenLoader />

  // Si no hay usuario → redirigir a login
  if (!user) return <Navigate to="/log" replace />

  return children
}
