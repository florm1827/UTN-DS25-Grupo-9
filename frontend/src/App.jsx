import { Routes, Route } from 'react-router-dom' ;
import Alquiler from './pages/Alquiler';
//import Entrenamientos from './pages/Entrenamientos' ;
import Home from './pages/Home' ;
//import Login from './pages/Login' ;
//import Nosotros from './pages/Nosotros';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
    return (
      <>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />} />
          {/*<Route path="/log" element={<Login />} />*/}
          {/*<Route path="/nos" element={<Nosotros />} />*/}
          <Route path="/alq" element={<Alquiler />} />
          {/*<Route path="/alq/entren" element={<Entrenamientos />} />*/}
        </Routes>
      </>
    );
}

export default App;