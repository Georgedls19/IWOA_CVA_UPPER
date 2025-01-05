import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    MenuItem,
    Card,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as esLocale } from 'date-fns/locale';

// Define la función y exporta
const renderAlmacenContent = (
    almacenView,
    state,
    handlers,
    utils) => {
    const { entradaData, salidaData, trasladoData, areas, clientes } = state;
    const { handleFormSubmit, handleSalidaFormSubmit, handleTrasladoFormSubmit, handleInputChange, handleSalidaInputChange, handleTrasladoInputChange, handleAlmacenViewChange } = handlers;
    const { setEntradaData, fieldEntradas, ubicaciones, setSalidaData } = utils;
    // Mismo código de renderAlmacenContent aquí, pero usa las props proporcionadas
    if (almacenView === 'entradas') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: '70px',
                    marginleft: '50px',
                    height: '75%',
                    width: '30%',
                }}
            >
                <Typography variant="h4" color="primary" gutterBottom>
                    Entradas
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Registrar nueva entrada de lote de tarimas.
                </Typography>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        {Object.keys(entradaData).map((field, index) => (
                            <Grid item xs={12} sm={8} md={6} lg={4} key={index}>
                                {field === 'fecha_recepcion' ? (
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                                        <DatePicker
                                            label="Fecha de Recepción"
                                            value={entradaData.fecha_recepcion}
                                            onChange={(newValue) =>
                                                setEntradaData({ ...entradaData, fecha_recepcion: newValue })
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth variant="outlined" size="small" />
                                            )}
                                        />
                                    </LocalizationProvider>
                                ) : field === 'area' ? (
                                    <TextField
                                        select
                                        fullWidth
                                        label="Área"
                                        value={entradaData.area}
                                        onChange={(e) =>//eSTE ONcHANGE es el evento de cambio en el campo area para que cuando se seleccione un valor se actualice el campo area
                                            setEntradaData({ ...entradaData, area: e.target.value }) // Asignamos el valor seleccionado al campo area
                                        }
                                        variant="outlined"
                                        size="small"
                                    >
                                        {areas.map((area) => (
                                            <MenuItem key={area.id} value={area.id}>
                                                {area.nombre_area}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ) : field === 'cliente' ? (
                                    <TextField
                                        select
                                        fullWidth
                                        label="Cliente"
                                        value={entradaData.cliente}
                                        onChange={(e) =>
                                            setEntradaData({ ...entradaData, cliente: e.target.value })
                                        }
                                        variant="outlined"
                                        size="small"
                                    >
                                        {clientes.map((cliente) => (
                                            <MenuItem key={cliente.id} value={cliente.id}>
                                                {cliente.nombre_cliente}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ) : field === 'estado' ? ( // Aquí agregamos el menú para el campo 'estado'
                                    <TextField
                                        select
                                        fullWidth
                                        label="Estado"
                                        value={entradaData.estado}
                                        onChange={(e) =>
                                            setEntradaData({ ...entradaData, estado: e.target.value })
                                        }
                                        variant="outlined"
                                        size="small"
                                    >
                                        {['A1', 'B1', 'B2', 'D1'].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        fullWidth
                                        label={fieldEntradas[field] || field}
                                        variant="outlined"
                                        size="small"
                                        name={field}
                                        value={entradaData[field]}
                                        onChange={handleInputChange}
                                        sx={{
                                            width: '100%',
                                            maxWidth: '300px',
                                        }}
                                    />
                                )}
                            </Grid>

                        ))}
                    </Grid>

                    <Box mt={3} display="flex" justifyContent="center">
                        {/* <CssBaseline /> */}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                padding: '8px 16px', // Tamaño reducido del botón
                                fontSize: '0.9rem', // Texto más pequeño
                                maxWidth: '150px', // Ancho máximo
                            }}
                            onClick={handleFormSubmit}
                        >
                            Registrar Entrada
                        </Button>

                    </Box>
                </form>
            </Box>
        );
    }
    if (almacenView === 'salidas') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: '70px',
                    marginleft: '50px',
                    height: '75%',
                    width: '30%',
                }}
            >
                <Typography variant="h4" color="primary" gutterBottom>
                    Salidas
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Registrar nueva salida de productos.
                </Typography>
                <form onSubmit={handleSalidaFormSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Código de Lote"
                                variant="outlined"
                                fullWidth
                                name="codigo_lote"
                                value={salidaData.codigo_lote}
                                onChange={handleSalidaInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Cantidad"
                                variant="outlined"
                                fullWidth
                                type="number"
                                name="cantidad"
                                value={salidaData.cantidad}
                                onChange={handleSalidaInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                select
                                label="Cliente"
                                variant="outlined"
                                fullWidth
                                name="Cliente"
                                value={salidaData.Cliente}
                                onChange={handleSalidaInputChange}
                                required
                            >
                                {clientes.map((cliente) => (
                                    <MenuItem key={cliente.id} value={cliente.id}>
                                        {cliente.nombre_cliente}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                                <DatePicker
                                    label="Fecha de Salida"
                                    value={salidaData.fecha_salida}
                                    onChange={(newValue) =>
                                        setSalidaData((prevState) => ({
                                            ...prevState,
                                            fecha_salida: newValue,
                                        }))
                                    }
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Observaciones"
                                variant="outlined"
                                fullWidth
                                name="observaciones"
                                value={salidaData.observaciones}
                                onChange={handleSalidaInputChange}
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button type="submit" variant="contained" color="primary">
                            Registrar Salida
                        </Button>
                    </Box>
                </form>

            </Box>
        );
    }
    if (almacenView === 'traslados') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: '100px',
                    height: '75%',
                    width: '25%',
                }}
            >
                <Typography variant="h4" color="primary" gutterBottom>
                    Traslados
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Registrar nuevo traslado de lote entre ubicaciones.
                </Typography>
                <form onSubmit={handleTrasladoFormSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Código de Lote"
                                variant="outlined"
                                fullWidth
                                name="codigo_lote"
                                value={trasladoData.codigo_lote}
                                onChange={handleTrasladoInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Ubicación de Origen"
                                variant="outlined"
                                fullWidth
                                name="ubicacion_origen"
                                value={trasladoData.ubicacion_origen}
                                onChange={handleTrasladoInputChange}
                                disabled // Deshabilitar edición manual
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Ubicación de Destino"
                                variant="outlined"//variant permite el color de la letra outlined es el de la paleta de colores de material-ui
                                fullWidth
                                name="ubicacion_destino"
                                value={trasladoData.ubicacion_destino}
                                onChange={handleTrasladoInputChange}
                                required
                            >
                                {ubicaciones.map((ubicacion) => (
                                    <MenuItem key={ubicacion.id} value={ubicacion.id}>
                                        {ubicacion.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Area"
                                variant="outlined"
                                fullWidth
                                type="text"
                                name="area"
                                value={entradaData.area}
                                onChange={(e) => (
                                    setEntradaData({ ...entradaData, area: e.target.value })

                                )}
                                required
                            >
                                {areas.map((area) => (
                                    <MenuItem key={area.id} value={area.id}>
                                        {area.nombre_area}
                                    </MenuItem>
                                ))}

                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Observaciones"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                name="observaciones"
                                value={trasladoData.observaciones}
                                onChange={handleTrasladoInputChange}
                            />
                        </Grid>
                    </Grid>

                    <Box mt={3} display="flex" justifyContent="center">
                        <Button type="submit" variant="contained" color="primary">
                            Registrar Traslado
                        </Button>
                    </Box>
                </form>
            </Box>
        );
    }
    return (
        <Box>
            <Typography variant="h4" color="primary" gutterBottom>
                Almacenes
            </Typography>
            <Typography variant="body1" gutterBottom>
                Selecciona una opción para continuar:
            </Typography>
            <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 4 }}>
                {[
                    {
                        title: 'Entradas',
                        description: 'Registrar nuevas entradas',
                        image: '/path/to/entradas_image.png', // Ruta de la imagen para Entradas
                        action: () => handleAlmacenViewChange('entradas'),
                    },
                    {
                        title: 'Salidas',
                        description: 'Registrar salidas de productos',
                        image: '/path/to/salidas_image.png', // Ruta de la imagen para Salidas
                        action: () => handleAlmacenViewChange('salidas'),
                    },
                    {
                        title: 'Traslados',
                        description: 'Gestionar traslados entre almacenes',
                        image: '/path/to/traslados_image.png', // Ruta de la imagen para Traslados
                        action: () => handleAlmacenViewChange('traslados'),
                    },
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            onClick={item.action}
                            sx={{
                                cursor: 'pointer',
                                height: 250,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5',
                                boxShadow: 3,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: '#e3f2fd',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={item.image}
                                alt={`${item.title} image`}
                                sx={{ height: 100, marginBottom: 2 }}

                            />
                            <Typography variant="h6" gutterBottom>
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {item.description}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default renderAlmacenContent;