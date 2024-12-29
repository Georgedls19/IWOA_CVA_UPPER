import { BrowserRouter, Routes, Route } from 'react-router-dom';// BrowserRouter permite navegar por la web desde cualquier parte del sitio web, Routes permite definir rutas y Route permite definir una ruta específica
import Login from './components/login';
import Crm from './components/crm';


import { Container } from '@mui/material';
// import Menu from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      {/* <Menu/> */}
      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/crm" element={<Crm />} />

        </Routes>
      </Container>
    </BrowserRouter>
  )
}
