import React, { useState } from 'react'; // Importamos React
import UpperIcon from "../assets/upper_icono.svg"; // Importamos la imagen de Upper
import InventoryIcon from '@mui/icons-material/Inventory';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ListItemIcon from '@mui/material/ListItemIcon';

import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CssBaseline,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Icon,

} from '@mui/material'; // Importamos Material UI para el diseño
import MenuIcon from '@mui/icons-material/Menu';

import DashboardIcon from '@mui/icons-material/Dashboard';
const Dashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(true); // Controla el estado del menú lateral
    const [selectedTab, setSelectedTab] = useState('welcome'); // Maneja las secciones del menú
    const [almacenView, setAlmacenView] = useState(null); // Maneja vistas dentro de Almacenes
    const [cards, setCards] = useState([
        { id: 1, title: 'Promedio de Entradas', content: '85%' },
        { id: 2, title: 'Promedio de Salidas', content: '78%' },
        { id: 3, title: 'Actualizaciones Recientes', content: '3 nuevas actualizaciones' },

    ]); // Lista inicial de cuadros en el dashboard

    // Estado para el formulario dinámico
    const [entradaData, setEntradaData] = useState({
        Lote: '',
        fecha_recepcion: '',
        ubicacion_id: '',
        estado: '',
        fabricante_id: '',
        no_serie: '',
        modelo_sku: '',
        proyecto: '',
        no_proyecto: '',
        cliente: '',
        cantidad: '',
        area_id: '',
        cliente_id: '',
    });

    const [salidaData, setSalidaData] = useState({ //Estos son labels y valores del formulario de salidas
        codigo_lote: '',
        cantidad: '',
        Cliente: '',
        fecha_salida: '',
        observaciones: ''
    });

    const validateCodigoLote = async (codigoLote) => { // Función para validar el código de lote
        try {
            const response = await fetch(`http://localhost:4000/lotes?codigo_lote=${codigoLote}`);
            if (!response.ok) {
                console.warn("El código de lote no existe.");
                return null;
            }
            const data = await response.json();
            return data; // Devuelve los datos del lote
        } catch (error) {
            console.error("Error al validar el código de lote:", error);
            return null;
        }
    };

    const handleSalidaInputChange = async (e) => { // Maneja cambios en los campos del formulario
        const { name, value } = e.target;

        setSalidaData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Si el usuario está editando el campo "codigo_lote"
        if (name === "codigo_lote" && value) {
            const loteData = await validateCodigoLote(value); // Valida el código de lote
            if (loteData) {
                setSalidaData((prevState) => ({
                    ...prevState,
                    Cliente: loteData.cliente || "", // Actualiza automáticamente el cliente
                }));
                console.log(`Cliente asociado: ${loteData.cliente}`);
            } else {
                console.warn("No se encontró el lote especificado.");
                setSalidaData((prevState) => ({
                    ...prevState,
                    Cliente: "", // Limpia el cliente si el lote no existe
                }));
            }
        }
    };

    const handleSalidaFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/almacen/registro-salida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(salidaData),
            });
            if (!response.ok) {
                throw new Error('Error al registrar la salida');
            }
            const data = await response.json();
            alert('Salida registrada con éxito: ' + JSON.stringify(data));
            setSalidaData({
                codigo_lote: '',
                cantidad: '',
                Cliente: '',
                fecha_salida: '',
                observaciones: ''
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar la salida');
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setEntradaData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Validar el código de lote
        if (name === "codigo_lote" && value) {
            const loteData = await validateCodigoLote(value);
            if (loteData) {
                // Actualiza el cliente automáticamente si se encuentra el lote
                setEntradaData((prevState) => ({
                    ...prevState,
                    cliente: loteData.cliente || "",
                }));
                console.log(`Cliente asociado: ${loteData.cliente}`);
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/almacen/registro-lote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entradaData),
            });
            if (!response.ok) {
                throw new Error('Error al registrar la entrada');
            }
            const data = await response.json();
            alert('Entrada registrada con éxito: ' + JSON.stringify(data));

            // Resetea el formulario después del envío
            setEntradaData({
                codigo_lote: '',
                fecha_recepcion: '',
                ubicacion_id: '',
                estado: '',
                fabricante_id: '',
                no_serie: '',
                modelo_sku: '',
                proyecto: '',
                no_proyecto: '',
                cliente: '',
                cantidad: '',
                area_id: '',
                cliente_id: '',
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar la entrada');
        }
    };

    const handleTabChange = (tab) => { //Función que cambia el estado del tab
        setSelectedTab(tab);
        setAlmacenView(null);
    };

    const handleAlmacenViewChange = (view) => {
        setAlmacenView(view);
    };

    const renderAlmacenContent = () => {
        if (almacenView === 'entradas') {
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
                        Entradas
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Registrar nueva entrada de lote de tarimas.
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={2} justifyContent="center">
                            {Object.keys(entradaData).map((field, index) => (
                                <Grid item xs={12} sm={8} md={6} lg={4} key={index}>
                                    <TextField
                                        fullWidth
                                        label={field}
                                        variant="outlined"
                                        size="small"
                                        name={field}
                                        value={entradaData[field]}
                                        onChange={handleInputChange}
                                        sx={{
                                            width: '100%', // Ajustar el ancho al contenedor
                                            maxWidth: '300px', // Ancho máximo reducido
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={3} display="flex" justifyContent="center">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    padding: '8px 16px', // Tamaño reducido del botón
                                    fontSize: '0.9rem', // Texto más pequeño
                                    maxWidth: '150px', // Ancho máximo
                                }}
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Typography variant="h4" color="primary" gutterBottom>
                        Salidas
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Registrar nueva salida de productos.
                    </Typography>
                    <form onSubmit={handleSalidaFormSubmit}>
                        <Grid container spacing={2}>
                            {Object.keys(salidaData).map((field, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <TextField
                                        fullWidth
                                        label={field}
                                        variant="outlined"
                                        size="small"
                                        name={field}
                                        value={salidaData[field]}
                                        onChange={handleSalidaInputChange}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={3}>
                            <Button type="submit" variant="contained" color="primary">
                                Registrar Salida
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

    const renderDashboardCards = () => (
        <Grid container spacing={3} justifyContent="center">
            {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>{/*xs:es el tamaño mínimo, sm:es el tamaño medio, md:es el tamaño máximo*/}
                    <Card
                        sx={{
                            maxWidth: 350, // Ancho fijo o proporcional para todas las tarjetas
                            width: '100%', // Asegura que ocupen su espacio dentro del grid
                            minHeight: 150, // Define una altura mínima
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
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
    );

    const renderContent = () => {
        switch (selectedTab) { //Se controla el estado del tab

            case 'almacenes': //Se renderiza el contenido del tab 'Almacenes'
                return renderAlmacenContent();
            case 'perfil': //Se renderiza el contenido del tab 'Perfil'
                return (
                    <Box>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Perfil
                        </Typography>
                        <Typography>
                            Aquí puedes actualizar tu información personal y preferencias.
                        </Typography>
                    </Box>
                );
            case 'inventario': //Se renderiza el contenido del tab 'Inventario'
                return (
                    <Box>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Inventario
                        </Typography>
                        <Typography>
                            Consulta y administra el inventario de productos.
                        </Typography>
                    </Box>
                );
            case 'configuracion': //Se renderiza el contenido del tab 'Configuración'
                return (
                    <Box>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Configuración
                        </Typography>
                        <Typography>
                            Aquí puedes gestionar y personalizar los cuadros del dashboard.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                setCards([
                                    ...cards,
                                    { id: cards.length + 1, title: 'Nuevo Cuadro', content: 'Información adicional' },
                                ])
                            }
                        >
                            Añadir Cuadro
                        </Button>
                    </Box>
                );
            default:
                return renderDashboardCards();
        }
    };

    return ( //Se renderiza el componente principal
        <Box sx={{ display: 'flex', height: '85vh', marginLeft: "20px", marginRight: "30rem" }}> {/* Contenedor principal ocupa toda la pantalla */}
            <CssBaseline />

            {/* Barra Superior */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{ mr: 1 }}
                        onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Upper Logistics - Sistema de Gestión
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Menú Lateral */}
            <Box
                sx={{
                    width: drawerOpen ? 240 : 60,
                    flexShrink: 0,
                    height: '100vh',
                    transition: 'width 0.3s ease',
                    position: 'fixed',
                    top: 64, // Alinea con la barra superior
                    left: 0,
                    bgcolor: '#f5f5f5',
                    boxShadow: 3,

                }}
            >
                <List>
                    {[
                        { text: 'Dashboard', icon: <DashboardIcon /> },
                        { text: 'Almacenes', icon: <StorageIcon /> },
                        { text: 'Inventario', icon: <InventoryIcon /> },
                        { text: 'Perfil', icon: <PersonIcon /> },
                        { text: 'Configuración', icon: <SettingsIcon /> },
                    ].map((item, index) => (
                        <ListItem disablePadding key={index}>
                            <ListItemButton
                                onClick={() => handleTabChange(item.text.toLowerCase())}
                                sx={{
                                    bgcolor: selectedTab === item.text.toLowerCase() ? '#5499c7' : 'white',
                                    '&:hover': { bgcolor: '#5499c7' },
                                    transition: 'background-color 0.3s',
                                    justifyContent: drawerOpen ? 'initial' : 'center',
                                    height: drawerOpen ? 'auto' : 'px',
                                    width: drawerOpen ? 'auto' : 'auto',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: drawerOpen ? '40px' : 'unset',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ display: drawerOpen ? 'block' : 'none' }} // Oculta labels si el menú está contraído
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </Box>

            {/* Contenido Principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: 3,
                    backgroundColor: '#f5f5f5',
                    height: '100vh', // Altura consistente
                    display: 'flex', // Asegura que los elementos internos sigan un diseño consistente
                    flexDirection: 'column',
                    alignItems: 'center', // Centra los componentes horizontalmente
                    overflow: 'auto', // Si el contenido excede la altura del contenedor, se puede mostrar scroll
                    transition: 'width 0.3s ease', // Animación de transición
                    marginRight: '-1200px',
                    marginLeft: '-700px',
                }}
            >
                {renderContent()}
            </Box>
        </Box>

    );
};

export default Dashboard;
