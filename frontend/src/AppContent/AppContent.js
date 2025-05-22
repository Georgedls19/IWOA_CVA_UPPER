import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from '../components/login';
import Crm from '../components/crm';
import Dashboard from '../components/crm';
import AppMovil from '../pages/Movil/AlmacenMovil';
import Almacen from "../pages/almacen";
import ThemeWrapper from '../ThemeWrapper';

export default function AppContent() {
    return (
        <Container>
            <Routes>
                {/* Login NO usa ThemeWrapper */}
                <Route path="/" element={<Login />} />

                {/* Estas rutas SÍ usan ThemeWrapper */}
                <Route
                    path="/crm"
                    element={
                        <ThemeWrapper>
                            <Crm />
                        </ThemeWrapper>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ThemeWrapper>
                            <Dashboard />
                        </ThemeWrapper>
                    }
                />
                <Route
                    path="/movil"
                    element={
                        <ThemeWrapper>
                            <AppMovil />
                        </ThemeWrapper>
                    }
                />
                <Route
                    path="/almacen"
                    element={
                        <ThemeWrapper>
                            <Almacen />
                        </ThemeWrapper>
                    }
                />
            </Routes>
        </Container>
    );
}
