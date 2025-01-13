import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
const Inventario = (fetchCodigosUbicaciones) => {
    const [tabla, setTabla] = useState('Stock');
    const [tipoMovimiento, setTipoMovimiento] = useState('');
    const [datos, setDatos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false); // Controla el diálogo de confirmación
    const [rowsWithStock, setRowsWithStock] = useState([]); // Filas con stock mayor a cero
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const rowsPerPage = 5; // Cantidad de filas por página

    const obtenerDatos = async () => {
        try {
            let url;
            switch (tabla) {
                case 'Stock':
                    url = 'http://localhost:4000/stock-summary';
                    break;
                case 'General':
                    url = 'http://localhost:4000/reportes';
                    break;
                case 'Lotes':
                    url = 'http://localhost:4000/lotes';
                    break;
                default:
                    url = 'http://localhost:4000/stock-summary';
            }

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

    const exportarExcel = async () => {
        // Establecer el título del reporte dependiendo de la tabla y el tipo de movimiento
        let nombreArchivo = 'REPORTE';
        let reporteTitulo = '';
        if (tabla === 'General') {
            reporteTitulo = 'REPORTE GENERAL';
            nombreArchivo += ' GENERAL';
        } else if (tabla === 'Entrada') {
            reporteTitulo = 'REPORTE GENERAL-ENTRADA';
            nombreArchivo += ' GENERAL-ENTRADA';
        } else if (tabla === 'Salida') {
            reporteTitulo = 'REPORTE GENERAL-SALIDA';
            nombreArchivo += ' GENERAL-SALIDA';
        } else if (tabla === 'Stock') {
            reporteTitulo = 'REPORTE STOCK';
            nombreArchivo += ' STOCK';
        }

        // Añadir tipo de movimiento si existe
        if (tabla === 'General' && tipoMovimiento) {
            reporteTitulo += ` - ${tipoMovimiento.toUpperCase()}`;
            nombreArchivo += `  -${tipoMovimiento.toUpperCase()}`;
        }

        nombreArchivo += '.xlsx';

        // Crear el libro y la hoja de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        // Añadir el título en las celdas B2, C2, D2, E2 con fondo azul
        worksheet.mergeCells('B2:E2');
        const titleCell = worksheet.getCell('B2');

        titleCell.value = reporteTitulo;  // Establecer el título en la celda B2
        titleCell.font = { bold: true, size: 25 };  // Negrita y tamaño de letra 25
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };  // Centrado
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' },  // Fondo azul
        };
        titleCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };

        // Determinar la posición inicial (B6)
        const startRow = 6;
        const startColumn = 1;

        // Convertir encabezados a mayúsculas
        const encabezados = Object.keys(datosFiltrados[0] || {}).map((key) => key.toUpperCase());

        // Agregar encabezados en la celda B6 y siguientes
        encabezados.forEach((header, index) => {
            const cell = worksheet.getCell(startRow, startColumn + index);
            cell.value = header;
            cell.font = { bold: true, size: 14 }; // Negrita y tamaño de letra
            cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrado
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'B7DEE8' }, // Fondo azul
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Ajustar la altura de las filas de encabezados
        worksheet.getRow(startRow).height = 30;

        // Agregar datos justo debajo de los encabezados
        datosFiltrados.forEach((fila, filaIndex) => {
            Object.values(fila).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + filaIndex, startColumn + colIndex);
                cell.value = value;
                cell.font = { size: 12 }; // Tamaño de letra
                cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrado
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // Ajustar ancho de las columnas basado en el contenido (encabezado y los valores de todas las filas)
        worksheet.columns = encabezados.map((header, index) => {
            // Obtener la longitud del encabezado
            const headerLength = header.length;

            // Obtener la longitud máxima de los valores de la columna, considerando todos los datos
            const maxDataLength = Math.max(
                ...datosFiltrados.map(fila => String(Object.values(fila)[index]).length)
            );

            // Determinar el ancho máximo entre encabezado y los valores de la columna
            const maxLength = Math.max(headerLength, maxDataLength);

            return { width: maxLength + 10 }; // Ancho basado en el contenido más 2 espacios
        });

        // Descargar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), nombreArchivo);
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
            // Filtrar las filas seleccionadas
            const filasAEliminar = datos.filter((fila) =>
                selectedRows.includes(fila.lote_id)
            );

            // Identificar filas con stock mayor a 0
            const filasConStock = filasAEliminar.filter(
                (fila) => fila.stock_actual > 0
            );

            if (filasConStock.length > 0) {
                // Guardar filas con stock para mostrar confirmación
                setRowsWithStock(filasConStock);
                setConfirmOpen(true); // Abrir diálogo de confirmación
                return;
            }

            // Obtener IDs de las filas seleccionadas que no tienen stock
            const idsSinStock = filasAEliminar.map((fila) => fila.lote_id);

            // Eliminar directamente las filas sin stock
            await eliminarFilas(idsSinStock);

            // Limpiar la selección y mostrar mensaje
            setSelectedRows([]);
            toast.success('Filas eliminadas con éxito.');
        } catch (error) {
            console.error('Error al intentar eliminar filas:', error.message);
            toast.error('Error al eliminar filas.');
        }
    };



    const eliminarFilas = async (ids) => {
        try {
            const response = await axios.delete('http://localhost:4000/eliminar-filas', {
                data: { ids },
            });

            if (!response.ok) {
                toast.error(response.data.message);
                return;
            }

            setDatos((prev) => prev.filter((fila) => !ids.includes(fila.lote_id)));
            setSelectedRows([]);
            toast.success(response.data.message);

            // Actualizar las ubicaciones disponibles tras eliminar filas
            await fetchCodigosUbicaciones(); // Llama a esta función para actualizar las ubicaciones
        } catch (error) {
            // console.error('Error al eliminar filas:', error.message);
            toast.error(`Error al eliminar las filas ${error.message}`);

        }
    };

    const handleConfirmDelete = async () => {
        // Eliminar filas con stock después de la confirmación
        await eliminarFilas(rowsWithStock.map((fila) => fila.lote_id));
        setConfirmOpen(false); // Cerrar el diálogo de confirmación
        setRowsWithStock([]); // Limpiar filas con stock
    };

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
        <Box
            sx={{
                padding: '2rem',
                margin: '1rem auto',
                width: '60%',
                maxWidth: '1200px',
            }}
        >
            <Box
                sx={{
                    color: '#2c3e50', // Color elegante y profesional
                    fontWeight: 'bold', // Texto más prominente
                    letterSpacing: '0.2em', // Espaciado para darle más estilo
                    textTransform: 'uppercase', // Todo en mayúsculas para un encabezado llamativo
                    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Sombra suave para mayor impacto
                    background: 'black', // Gradiente suave
                    WebkitBackgroundClip: 'text', // Usamos el gradiente como color del texto
                    WebkitTextFillColor: 'transparent', // Hacemos que el fondo rellene el texto
                    marginLeft: '1rem',
                    marginBottom: '2rem', // Este reemplaza a gutterBottom
                }}
            >
                Inventario
            </Box>
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
                    <IconButton
                        variant="contained"
                        color="green"
                        onClick={exportarExcel}
                        fullWidth
                        backgroundColor='green'
                    >
                        <InsertDriveFileIcon color='green'>Exportar</InsertDriveFileIcon>Exportar
                    </IconButton>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <IconButton
                        variant="contained"
                        color="error"
                        onClick={eliminarFilasSeleccionadas}
                        fullWidth
                        disabled={selectedRows.length === 0}
                    >
                        <DeleteIcon color='red'>Eliminar</DeleteIcon>Eliminar
                    </IconButton>
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

            {/* Diálogo de confirmación */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Filas con stock</DialogTitle>
                <DialogContent>
                    <Typography>
                        Hay filas con stock mayor a 0. ¿Deseas continuar con la eliminación?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Inventario;