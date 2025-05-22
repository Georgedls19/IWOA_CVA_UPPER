import React, { useState, useEffect } from 'react';
import { Paper, Box, Grid, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import InfoIcon from '@mui/icons-material/Info';
import { theme } from '../context/themeContext';
import { useTheme } from '@mui/material/styles';
import { dark } from '@mui/material/styles/createPalette';

// Registrar componentes de gráficos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const DashboardCards = ({ cards, onCardClick }) => {
    const [barData, setBarData] = useState(null); // Datos de la gráfica
    const [ubicaciones, setUbicaciones] = useState([]); // Datos de las ubicaciones
    const [showMatrix, setShowMatrix] = useState(false); // Estado para mostrar u ocultar la matriz
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark'; // Usamos el tema para determinar si el modo es oscuro o claro

    useEffect(() => {// Usamos useEffect para realizar acciones cuando se renderice la página
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
        const fetchUbicaciones = async () => {
            try {
                const response = await fetch('http://localhost:4000/ubicaciones');
                const data = await response.json();
                setUbicaciones(data);
            } catch (error) {
                console.error('Error al cargar ubicaciones:', error);
            }
        };
        fetchChartData();
        fetchUbicaciones();
    }, []);

    return (
        <Box
            sx={{
                padding: '2rem',
                // backgroundColor: theme.palette.background.isDark,
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                margin: '1rem auto',
                width: '60%',
                maxWidth: '1200px',
            }}
        >

            <Box>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        // color: '#2c3e50', // Color elegante y profesional
                        // background: 'black', // Gradiente suave
                        background: isDark ? 'darkgray' : 'black',
                        color: isDark ? '#ffffff' : '#2c3e50',
                        fontWeight: 'bold', // Texto más prominente
                        letterSpacing: '0.2em', // Espaciado para darle más estilo
                        textTransform: 'uppercase', // Todo en mayúsculas para un encabezado llamativo
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Sombra suave para mayor impacto                                        
                        WebkitBackgroundClip: 'text', // Usamos el gradiente como color del texto
                        WebkitTextFillColor: 'transparent', // Hacemos que el fondo rellene el texto
                        marginLeft: '1rem',
                        marginBottom: '2rem',
                    }}
                >
                    Dashboard
                </Typography>
            </Box>

            {/* Tarjetas del Dashboard */}
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.id} onClick={() => onCardClick(card.id)}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                height: 150,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                boxShadow: 3,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: isDark
                                        ? theme.palette.grey[800]
                                        : theme.palette.grey[100],
                                },
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
            <Box mt={4}>
                <Typography
                    sx={{
                        color: isDark ? '#ffffff' : '#2c3e50', // Color elegante y profesional
                    }}
                    variant="h5"
                    utterBottom>
                    Comparación de Entradas y Salidas
                </Typography>
                {barData ? (
                    <Bar
                        data={barData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Entradas vs Salidas Mensuales' },

                            },
                            scales: { y: { beginAtZero: true } },
                        }}
                    />
                ) : (
                    <Typography color="#7f8c8d">Cargando gráfica...</Typography>
                )}
            </Box>

            {/* Matriz de Ubicaciones */}
            <Box mt={4}>
                <Typography
                    sx={{
                        color: isDark ? '#ffffff' : '#2c3e50',
                    }}
                    variant="h5"
                    gutterBottom>
                    Ubicaciones Disponibles
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    <Tooltip title="Muestra las ubicaciones disponibles y ocupadas">
                        <InfoIcon sx={{ color: '#5499c7' }} />
                    </Tooltip>
                    <Typography
                        sx={{ color: isDark ? '#ffffff' : '#2c3e50', }}
                    >
                        Las casillas verdes están disponibles. Las rojas están ocupadas.
                    </Typography>
                </Box>
                <Box>
                    <Tooltip title={showMatrix ? 'Ocultar matriz' : 'Mostrar matriz'}>
                        <Card
                            sx={{
                                backgroundColor: isDark ? 'darkgray' : '#1976d2',
                                color: isDark ? 'black' : 'white',
                                ":hover"
                                    : {
                                    backgroundColor: isDark ? '#5499c7' : '#265980',
                                    color: isDark ? 'white' : '#ffffff',
                                },
                                padding: '1rem',
                                textAlign: 'center',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#4682b4' },
                            }}
                            onClick={() => setShowMatrix(!showMatrix)}
                        >
                            <Typography variant="body1">
                                {showMatrix ? 'Ocultar Matriz' : 'Mostrar Matriz'}
                            </Typography>
                        </Card>
                    </Tooltip>
                </Box>
                {showMatrix && (
                    <Box
                        mt={2}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)', // Exactamente 7 columnas por fila
                            gap: '10px',
                        }}
                    >
                        {ubicaciones.map((ubicacion) => (
                            <Tooltip
                                key={ubicacion.id}
                                title={
                                    ubicacion.ocupado ? (
                                        <Box>
                                            <Typography variant="body2">
                                                <strong>SKU:</strong> {ubicacion.sku || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Código Lote:</strong> {ubicacion.codigo_lote || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Proyecto:</strong> {ubicacion.proyecto || 'N/A'}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        'Disponible'
                                    )
                                }
                                placement="top"
                            >
                                <Box
                                    sx={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: ubicacion.ocupado ? '#e74c3c' : '#2ecc71',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.1)' },
                                    }}
                                >
                                    {ubicacion.codigo}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                )}

            </Box>
        </Box>
    );
};

export default DashboardCards;
