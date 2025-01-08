import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TableCell,
    TextField,
    Button,
    Grid,
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    Typography,
} from '@mui/material';

const Inventario = () => {
    const [tabla, setTabla] = useState('Stock');
    const [tipoMovimiento, setTipoMovimiento] = useState('');
    const [datos, setDatos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const rowsPerPage = 5; // Cantidad de filas por página

    const obtenerDatos = async () => {
        try {
            const url =
                tabla === 'Stock'
                    ? 'http://localhost:4000/stock-summary'
                    : 'http://localhost:4000/reportes';
            const respuesta = await axios.get(url);
            setDatos(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error.message);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, [tabla]);

    const datosFiltrados = datos.filter((fila) => {
        const coincideLoteId = fila.lote_id.toString().toLowerCase().includes(searchTerm.toLowerCase());
        const coincideTipoMovimiento = tipoMovimiento ? fila.tipo_movimiento === tipoMovimiento : true;
        return coincideLoteId && coincideTipoMovimiento;
    });

    const handleTablaChange = (e) => {
        const nuevaTabla = e.target.value;
        setTabla(nuevaTabla);
        if (nuevaTabla === 'Stock') {
            setTipoMovimiento('');
        }
        setCurrentPage(1); // Reiniciar a la primera página al cambiar de tabla
    };

    const exportarExcel = () => {
        // Lógica para exportar datos a Excel (omitida por simplicidad).
    };

    const toggleRowSelection = (lote_id) => {
        setSelectedRows((prev) =>
            prev.includes(lote_id)
                ? prev.filter((id) => id !== lote_id)
                : [...prev, lote_id]
        );
    };

    const eliminarFilasSeleccionadas = async () => {
        try {
            const response = await axios.delete('http://localhost:4000/eliminar-filas', {
                data: { ids: selectedRows },
            });
            setDatos((prev) => prev.filter((fila) => !selectedRows.includes(fila.lote_id)));
            setSelectedRows([]);
            alert(response.data.message);
        } catch (error) {
            console.error('Error al eliminar filas:', error.message);
            alert('Error al eliminar las filas');
        }
    };

    // Obtener datos para la página actual
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = datosFiltrados.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(datosFiltrados.length / rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div>
            <h1>Inventario</h1>
            <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar tabla</InputLabel>
                        <Select
                            value={tabla}
                            onChange={handleTablaChange}
                            label="Seleccionar tabla"
                            fullWidth
                        >
                            <MenuItem value="Stock">Stock</MenuItem>
                            <MenuItem value="General">General</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {tabla === 'General' && (
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de movimiento</InputLabel>
                            <Select
                                value={tipoMovimiento}
                                onChange={(e) => setTipoMovimiento(e.target.value)}
                                label="Tipo de movimiento"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="Entrada">Entrada</MenuItem>
                                <MenuItem value="Salida">Salida</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                )}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Buscar por Lote ID"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={exportarExcel}
                        fullWidth
                    >
                        Exportar a Excel
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={eliminarFilasSeleccionadas}
                        fullWidth
                        disabled={selectedRows.length === 0}
                    >
                        Eliminar Filas Seleccionadas
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                Seleccionar
                            </TableCell>
                            <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                Lote ID
                            </TableCell>
                            {tabla === 'Stock' && (
                                <>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Total Entradas
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Total Salidas
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Stock Actual
                                    </TableCell>
                                </>
                            )}
                            {tabla === 'General' && (
                                <>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Fecha Movimiento
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Tipo Movimiento
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Descripción
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Cantidad
                                    </TableCell>
                                    <TableCell style={{ backgroundColor: '#4F81BD', color: 'white', padding: '8px' }}>
                                        Responsable
                                    </TableCell>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((fila) => (
                            <tr key={fila.lote_id} style={{ borderBottom: '1px solid #ddd' }}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(fila.lote_id)}
                                        onChange={() => toggleRowSelection(fila.lote_id)}
                                    />
                                </TableCell>
                                <TableCell>{fila.lote_id}</TableCell>
                                {tabla === 'Stock' && (
                                    <>
                                        <TableCell>{fila.total_entradas}</TableCell>
                                        <TableCell>{fila.total_salidas}</TableCell>
                                        <TableCell>{fila.stock_actual}</TableCell>
                                    </>
                                )}
                                {tabla === 'General' && (
                                    <>
                                        <TableCell>{fila.fecha_movimiento}</TableCell>
                                        <TableCell>{fila.tipo_movimiento}</TableCell>
                                        <TableCell>{fila.descripcion}</TableCell>
                                        <TableCell>{fila.cantidad}</TableCell>
                                        <TableCell>{fila.responsable}</TableCell>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <Button
                        variant="outlined"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        sx={{ marginRight: '8px' }}
                    >
                        Anterior
                    </Button>
                    <Typography variant="body1">
                        Página {currentPage} de {totalPages}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        sx={{ marginLeft: '8px' }}
                    >
                        Siguiente
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default Inventario;
