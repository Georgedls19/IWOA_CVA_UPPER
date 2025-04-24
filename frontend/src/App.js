import { BrowserRouter, Routes, Route } from 'react-router-dom';// BrowserRouter permite navegar por la web desde cualquier parte del sitio web, Routes permite definir rutas y Route permite definir una ruta específica
import Login from './components/login';
import Crm from './components/crm';
import Dashboard from './components/crm';
import AppMovil from './pages/Movil/AlmacenMovil';
import Almacen from "./pages/almacen";
import { Container } from '@mui/material';
// import Menu from './components/Navbar';
import { ThemeProvider } from './context/themeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Container>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/crm" element={<Crm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movil" element={<AppMovil />} />
            <Route path="/almacen" element={<Almacen />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  )
}
