import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import RackVisualization from '../services/ubicaciones';

// Registro de componentes de gráficos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCards = ({ cards, onCardClick }) => {
    const [barData, setBarData] = useState(null); // Datos de la gráfica
    const [lastActivity, setLastActivity] = useState(null); // Última actividad de usuario

    useEffect(() => {
        // Carga de datos de la gráfica de entradas y salidas
        const fetchChartData = async () => {
            try {
                const response = await fetch('http://localhost:4000/entradas-salidas');
                const data = await response.json();

                setBarData({
                    labels: data.months,
                    datasets: [
                        {
                            label: 'Entradas',
                            data: data.entradas,
                            backgroundColor: '#42A5F5',
                        },
                        {
                            label: 'Salidas',
                            data: data.salidas,
                            backgroundColor: '#FF7043',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error al cargar datos de la gráfica:', error);
            }
        };

        // Carga de la última actividad del usuario
        const fetchLastActivity = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:4000/actividades/ultima', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLastActivity(data);
                } else {
                    console.error('Error al obtener la última actividad');
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
            }
        };

        fetchChartData();
        fetchLastActivity();
    }, []);

    return (
        <Box
            sx={{
                padding: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                width: '55%',
            }}
        >
            {/* Sección de Tarjetas */}
            <Grid container spacing={3} justifyContent="center">
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.id} onClick={() => onCardClick(card.id)}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5',
                                boxShadow: 3,
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: '#e3f2fd',
                                },
                                width: '100%',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {card.title}
                                </Typography>
                                <Typography variant="body1">{card.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Sección de Gráfica */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Comparación de Entradas y Salidas
                </Typography>
                {barData ? (
                    <Bar
                        data={barData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Entradas vs Salidas Mensuales',
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                ) : (
                    <Typography>Cargando gráfica...</Typography>
                )}
            </Box>

            {/* Acciones rápidas */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Acciones Rápidas
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
                    Ver Reportes
                </Button>
                <Button variant="contained" color="secondary">
                    Exportar Datos
                </Button>
            </Box>

            {/* Última Actividad de Usuarios */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Última Actividad de Usuarios
                </Typography>
                {lastActivity ? (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Última Actividad
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Usuario: {lastActivity.usuario}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Acción: {lastActivity.accion}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Fecha: {new Date(lastActivity.fecha).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Cargando última actividad...
                    </Typography>
                )}
            </Box>

            {/* Visualización de Racks */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Ubicaciones Disponibles
                </Typography>
                <RackVisualization />
            </Box>
        </Box>
    );
};

export default DashboardCards;
