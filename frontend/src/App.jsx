import { Routes, Route } from 'react-router-dom' ;
import Alquiler from './pages/Alquiler';
//import Entrenamientos from './pages/Entrenamientos' ;
import Home from './pages/Home' ;
import AdminPage from './pages/Admin' ;
import Login from './pages/Login' ;
import Register from './pages/Register';
//import Nosotros from './pages/Nosotros';
import CssBaseline from '@mui/material/CssBaseline';
import Nosotros from './pages/Nosotros';
import Notificaciones from './pages/Notificaciones.jsx'
import AdminTurnos from './pages/AdminTurnos.jsx';
import Perfil from './pages/Perfil.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
    return (
      <>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log" element={<Login />} />
          {/*<Route path="/nos" element={<Nosotros />} />*/}
          <Route path="/alq" element={<Alquiler />} />
          {/*<Route path="/alq/entren" element={<Entrenamientos />} />*/}
          <Route path="/reg" element={<Register/>} />
          
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/nos" element={<Nosotros />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/admin/turnos" element={<AdminTurnos />} />
          <Route path="/perfil" element={
        <ProtectedRoute>
          <Perfil />
        </ProtectedRoute>
      } />
        </Routes>
      </>
    );
}

export default App;