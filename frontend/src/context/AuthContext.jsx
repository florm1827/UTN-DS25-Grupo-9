// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const API_URL = 'http://localhost:3000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // al montar, intentar recuperar el token del localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      setLoading(false)
      return
    }

    // si hay token, pedir /auth/me
    fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user)
          setToken(savedToken)
        } else {
          localStorage.removeItem('token')
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (data) => {
    // data = { token, user }
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
