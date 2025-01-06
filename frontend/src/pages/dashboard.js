import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCards = ({ cards, onCardClick }) => {
    const [barData, setBarData] = useState(null);
    const [locations, setLocations] = useState([]);
    const [userActivity, setUserActivity] = useState([]);


    useEffect(() => {
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

        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:4000/ubicaciones');
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error al cargar ubicaciones:', error);
            }
        };

        const fetchUserActivity = async () => {
            try {
                const response = await fetch('http://localhost:4000/usuarios/actividad');
                const data = await response.json();
                setUserActivity(data);
            } catch (error) {
                console.error('Error al cargar actividad de usuarios:', error);
            }
        };

        fetchChartData();
        fetchLocations();
        fetchUserActivity();
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
            {/* Cards Section */}
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

            {/* Bar Chart Section */}
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

            {/* Quick Actions */}
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

            {/* Last User Activity */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Última Actividad de Usuarios
                </Typography>
                {userActivity.length > 0 ? (
                    userActivity.map((activity, index) => (
                        <Typography key={index}>
                            {activity.usuario}: {activity.accion} en {activity.fecha}
                        </Typography>
                    ))
                ) : (
                    <Typography>No hay actividad reciente.</Typography>
                )}
            </Box>

            {/* Locations Section */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Ubicaciones Disponibles
                </Typography>
                {locations.length > 0 ? (
                    locations.map((location, index) => (
                        <Typography key={index}>{location.nombre}</Typography>
                    ))
                ) : (
                    <Typography>No hay ubicaciones disponibles.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default DashboardCards;
