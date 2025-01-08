import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const RackVisualization = () => {
    const [rackData, setRackData] = useState([]);

    useEffect(() => {
        const fetchRackData = async () => {
            try {
                const response = await fetch('http://localhost:4000/ubicaciones');
                const data = await response.json();

                // Transformar los datos para que haya máximo 7 casillas por fila
                const transformedData = groupIntoRows(data, 5);
                setRackData(transformedData);
            } catch (error) {
                console.error('Error al cargar ubicaciones:', error);
            }
        };

        fetchRackData();
    }, []);

    // Función para agrupar ubicaciones en filas de un tamaño máximo dado
    const groupIntoRows = (data, itemsPerRow) => {
        if (!Array.isArray(data)) return [];

        const rows = [];
        for (let i = 0; i < data.length; i += itemsPerRow) {
            rows.push(data.slice(i, i + itemsPerRow));
        }
        return rows;
    };

    const getCellStatus = (location) => {
        return location.ocupado ? 'Ocupado' : 'Disponible';
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                gap: '0.5rem',
            }}
        >
            <Typography variant="h5" gutterBottom>
                Visualización de Racks
            </Typography>
            <Grid container spacing={0.5} justifyContent="center">
                {rackData.length > 0 ? (
                    rackData.map((row, rowIndex) => (
                        <Grid
                            container
                            item
                            spacing={0.5}
                            key={rowIndex}
                            justifyContent="center"
                        >
                            {row.map((location, colIndex) => (
                                <Grid item key={colIndex} xs="auto">
                                    <Card
                                        sx={{
                                            width: 70,
                                            height: 50,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxShadow: 3,
                                            backgroundColor: location.ocupado ? '#ff7043' : '#42a5f5',
                                            color: 'white',
                                            cursor: 'pointer',
                                            margin: '2px', // Reducir espacio entre tarjetas
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: '0.3rem',
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                                                {location.codigo}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                                                {getCellStatus(location)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1">No hay datos disponibles.</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default RackVisualization;
