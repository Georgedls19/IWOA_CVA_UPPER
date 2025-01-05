import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    IconButton,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const RenderInventoryContent = ({ inventoryData: initialData }) => {
    const rowsPerPage = 5; // Límite de filas por página
    const [inventoryData, setInventoryData] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Cálculo del total de páginas
    const totalPages = Math.ceil(inventoryData.length / rowsPerPage);

    // Filtra los datos que se mostrarán en la página actual
    const currentData = inventoryData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSearch = () => { // Función para buscar en el campo de búsqueda
        const filteredData = initialData.filter(item =>
            item.codigo_lote.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.cliente.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setInventoryData(filteredData);
        setCurrentPage(1); // Reinicia a la primera página después de buscar
    };

    const exportInventory = () => {// Función para exportar los datos a un archivo CSV
        const csvContent = [
            ["Código de Lote", "Cliente", "Cantidad", "Ubicación", "Estado"],
            ...inventoryData.map(item => [
                item.codigo_lote,
                item.cliente,
                item.cantidad,
                item.ubicacion,
                item.estado
            ])
        ]
            .map(e => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "inventario.csv";
        link.click();
    };

    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            try {
                const response = await fetch(`http://localhost:4000/api/lotes?page=${newPage}&limit=5`);
                const data = await response.json();
                setInventoryData(data.data);
            } catch (error) {
                console.error('Error al cambiar de página:', error);
            }
        }
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '85vh', margin: '0 20px' }}>
            <Typography variant="h4" color="primary" gutterBottom>
                Inventario
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item xs={8}>
                    <TextField
                        label="Buscar en inventario"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <IconButton onClick={handleSearch} color="primary">
                        <SearchIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetAppIcon />}
                        onClick={exportInventory}
                    >
                        Exportar
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código de Lote</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Ubicación</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.codigo_lote}</TableCell>
                                <TableCell>{item.cliente}</TableCell>
                                <TableCell>{item.cantidad}</TableCell>
                                <TableCell>{item.ubicacion}</TableCell>
                                <TableCell>{item.estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginación */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 2,
                    gap: 1,
                }}
            >
                <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {//Math min devuelve el menor de los dos numeros
                    const pageNumber =
                        totalPages <= 7 || currentPage <= 4 // Los "||" permite 
                            ? i + 1
                            : Math.max(1, currentPage - 3) + i;

                    if (pageNumber > totalPages) return null;

                    return (
                        <Button
                            key={pageNumber}
                            variant={pageNumber === currentPage ? 'contained' : 'outlined'}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}

                <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default RenderInventoryContent;
