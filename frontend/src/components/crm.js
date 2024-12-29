import React, { useState } from 'react'; // Importamos React
import UpperIcon from "../assets/upper_icono.svg"; // Importamos la imagen de Upper
import InventoryIcon from '@mui/icons-material/Inventory';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
// import { Account } from '@toolpad/core/Account';
//componentes DatePicker 
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as esLocale } from 'date-fns/locale';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useEffect } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,


    MenuItem,
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
    const [ubicaciones, setUbicaciones] = useState([]); // Opciones de ubicaciones
    const [areas, setAreas] = useState([]); // Opciones de áreas
    const [clientes, setClientes] = useState([]); // Opciones de clientes
    const [inventoryData, setInventoryData] = useState([]); // Datos del inventario
    const [searchQuery, setSearchQuery] = useState(""); // Consulta de búsqueda
    const showtoast = () => {
        toast.success('Hola', {
            position: "top-right",
            autoClose: 3000,
        });
    };
    //Funciones     
    useEffect(() => {//Este useEffect se encarga de obtener las opciones de ubicaciones, áreas y clientes
        const fetchData = async () => {
            try {
                // const ubicacionesResponse = await fetch('http://localhost:4000/ubicaciones');
                // const ubicacionesData = await ubicacionesResponse.json();
                // setUbicaciones(ubicacionesData);

                const areasResponse = await fetch('http://localhost:4000/areas');
                const areasData = await areasResponse.json();
                setAreas(areasData);

                const clientesResponse = await fetch('http://localhost:4000/clientes');
                const clientesData = await clientesResponse.json();
                setClientes(clientesData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        fetchData();

        const fetchInventory = async () => {
            try {
                const response = await fetch("http://localhost:4000/inventario"); // Ruta del endpoint del inventario
                const data = await response.json();
                setInventoryData(data);
            } catch (error) {
                console.error("Error al cargar el inventario:", error);
            }
        };

        fetchInventory();
    }, []);
    // Estado para el formulario dinámico
    const [entradaData, setEntradaData] = useState({ //aqui se guarda el estado del formulario dinámico
        codigo_lote: "",
        ubicacion: "",
        estado: "",
        no_fabricante: "",
        no_serie: "",
        modelo_sku: "",
        proyecto: "",
        cliente: "",
        area: "",
        no_proyecto: "",
        fecha_recepcion: "",
        cantidad: "",
    });
    const fieldEntradas = {
        codigo_lote: "Codigo de Lote",
        ubicacion: "Ubicación",
        estado: "Estado de la Entrada",
        no_fabricante: "# Fabricante",
        no_serie: "# serie",
        modelo_sku: "Modelo/SKU",
        proyecto: "Proyecto",
        cliente: "Cliente",
        area: "Area",
        no_proyecto: "# Proyecto",
        fecha_recepcion: "Fecha de Recepción",
        cantidad: "Cantidad",

    };
    const [salidaData, setSalidaData] = useState({ //Estos son labels y valores del formulario de salidas
        codigo_lote: '',
        cantidad: '',
        Cliente: '',
        fecha_salida: '',
        observaciones: ''
    });
    const [trasladoData, setTrasladoData] = useState({
        codigo_lote: '',
        ubicacion_origen: '',
        ubicacion_destino: '',
        cantidad: '',
        area: '',
        observaciones: '',
    });
    const fieldSalidas = {
        codigo_lote: "Codigo de Lote",
        cantidad: "Cantidad",
        Cliente: "Cliente",
        fecha_salida: "Fecha de Salida",
        observaciones: "Observaciones",
    }
    const validateCodigoLote = async (codigoLote) => { // Función para validar el código de lote del formulario de salidas
        try {
            const response = await fetch(`http://localhost:4000/lotes?codigo_lote=${codigoLote}`);
            if (!response.ok) {
                console.warn("El código de lote no existe.");
                return null;
            }
            const data = await response.json();//Aquí se obtiene el lote del código de lote
            return data; // Devuelve los datos del lote 
        } catch (error) {
            console.error("Error al validar el código de lote:", error);
            return null;
        }
    };
    const handleSalidaInputChange = async (e) => {
        const { name, value } = e.target;

        setSalidaData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Si se está escribiendo en el campo "codigo_lote"
        if (name === "codigo_lote" && value) {
            try {
                const response = await fetch(`http://localhost:4000/lotes?codigo_lote=${value}`);
                if (response.ok) {
                    const loteData = await response.json();

                    // Actualizar el campo "Cliente" con el cliente del lote
                    setSalidaData((prevState) => ({
                        ...prevState,
                        Cliente: loteData.cliente || "",
                    }));
                    console.log(`Cliente asociado: ${loteData.cliente}`);
                } else {
                    console.warn("No se encontró información para el código de lote.");
                    setSalidaData((prevState) => ({
                        ...prevState,
                        Cliente: "", // Limpiar el campo Cliente si no se encuentra información
                    }));
                }
            } catch (error) {
                console.error("Error al obtener datos del lote:", error);
            }
        }
    };
    const handleSalidaFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Preparar los datos para la solicitud
            const salidaPayload = {
                codigo_lote: salidaData.codigo_lote,
                cantidad: parseInt(salidaData.cantidad, 10), // Asegurarse de que sea un número
                cliente_id: salidaData.Cliente, // ID del cliente
                fecha: salidaData.fecha_salida, // Fecha de salida
                observaciones: salidaData.observaciones || '', // Observaciones opcionales
            };

            // Hacer la solicitud al servidor
            const response = await fetch('http://localhost:4000/almacen/registro-salida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(salidaPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar la salida');
            }

            const result = await response.json();
            alert(`Salida registrada con éxito. 
               Movimiento: ${JSON.stringify(result.movimiento)}, 
               Lote Actualizado: ${JSON.stringify(result.loteActualizado)}`);

            // Limpiar el formulario después de registrar la salida
            setSalidaData({
                codigo_lote: '',
                cantidad: '',
                Cliente: '',
                fecha_salida: '',
                observaciones: '',
            });
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error al registrar la salida: ${error.message}`);
        }
    };
    const handleInputChange = async (e) => {//Esta función se encarga de manejar los cambios en los campos de entrada y salida
        const { name, value } = e.target; // Obtener el nombre y el valor del evento | target es el objeto que contiene todos los datos del evento|name es el nombre del campo y value es su valor
        setEntradaData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Validar el código de lote
        if (name === "codigo_lote" && value) {// si el nombre es codigo_lote y el valor no es null
            const loteData = await validateCodigoLote(value);//aqui se valida el código de lote
            if (loteData) {

                // Actualiza el cliente automáticamente si se encuentra el lote
                setEntradaData((prevState) => ({
                    ...prevState,
                    cliente: loteData.cliente || "",
                }));
                console.log(`Cliente asociado: ${loteData.cliente}`);
            }
        } else if (name === " ") {//Si esta vacio la celda se borra
            setEntradaData((prevState) => ({
                ...prevState,
                [name]: "",
            }));
            console.log(`Se borró la celda ${name}`);
        }
    };
    const handleFormSubmit = async (e) => {//Esta función se encarga de enviar los datos al servidor en la seccion de entradas  
        e.preventDefault();

        try {
            // Registrar el lote en la tabla 'lotes'
            const loteResponse = await fetch('http://localhost:4000/almacen/registro-lote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entradaData),
            });

            if (!loteResponse.ok) {
                throw new Error('Error al registrar el lote');
            }

            const loteData = await loteResponse.json(); // Suponiendo que devuelve el `id` del lote registrado

            // Registrar el movimiento en la tabla 'movimientos'
            const movimientoData = {
                lote_id: entradaData.codigo_lote, // Usamos el `id` del lote registrado como el `lote_id`    
                fecha_movimiento: new Date().toISOString(), // Fecha actual en formato ISO                
                tipo_movimiento: 'Entrada', // Valor por defecto
                descripcion: 'Registro de nueva entrada', // Descripción por defecto
                cantidad: entradaData.cantidad, // Cantidad por defecto
                responsable: "Jose", // Responsable por defecto
            };

            const movimientoResponse = await fetch('http://localhost:4000/movimientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movimientoData),
            });

            if (!movimientoResponse.ok) {
                throw new Error('Error al registrar el movimiento');
            }

            const movimientoResult = await movimientoResponse.json();

            toast.success(`Entrada registrada con éxito (Lote ID: ${loteData.id}, Movimiento ID: ${movimientoResult.id})`,
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );

            // Resetea el formulario después del envío
            setEntradaData({
                codigo_lote: "",
                ubicacion: "",
                estado: "",
                no_fabricante: "",
                no_serie: "",
                modelo_sku: "",
                proyecto: "",
                cliente: "",
                area: "",
                no_proyecto: "",
                fecha_recepcion: "",
                cantidad: "",
            });
        } catch (error) {
            toast.error('Error:', error,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        }
    };
    const handleTrasladoInputChange = async (e) => {
        const { name, value } = e.target;

        setTrasladoData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Si se está escribiendo en el campo "codigo_lote"
        if (name === "codigo_lote" && value) {
            try {
                const response = await fetch(`http://localhost:4000/lotes?codigo_lote=${value}`);
                if (response.ok) {
                    const loteData = await response.json();

                    // Actualizar el campo "ubicacion_origen" con la ubicación del lote
                    setTrasladoData((prevState) => ({
                        ...prevState,
                        ubicacion_origen: loteData.ubicacion || "",
                    }));
                    console.log(`Ubicación de origen: ${loteData.ubicacion}`);
                } else {
                    console.warn("No se encontró información para el código de lote.");
                    setTrasladoData((prevState) => ({
                        ...prevState,
                        ubicacion_origen: "", // Limpiar el campo si no se encuentra información
                    }));
                }
            } catch (error) {
                console.error("Error al obtener datos del lote:", error);
            }
        }
    };
    const handleTrasladoFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/traslados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trasladoData),
            });
            if (!response.ok) {
                throw new Error('Error al registrar el traslado');
            }
            const result = await response.json();
            alert('Traslado registrado con éxito: ' + JSON.stringify(result));

            setTrasladoData({
                codigo_lote: '',
                ubicacion_origen: '',
                ubicacion_destino: '',
                cantidad: '',
                area: '',
                observaciones: '',
            });
        } catch (error) {
            console.error('Error al registrar el traslado:', error);
            alert('Hubo un error al registrar el traslado');
        }
    };
    const handleTabChange = (tab) => { //Función que cambia el estado del tab
        setSelectedTab(tab);
        setAlmacenView(null);
    };
    const handleAlmacenViewChange = (view) => {
        setAlmacenView(view);
    };
    //Función para los campos del formulario de Almacenes
    const renderFormField = (field, value, onChange, options = {}) => {//función para los campos del formulario
        const { label, type, select, selectOptions } = options;

        if (type === 'date') {
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                    <DatePicker
                        label={label}
                        value={value}
                        onChange={(newValue) => onChange(field, newValue)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth variant="outlined" size="small" />
                        )}
                    />
                </LocalizationProvider>
            );
        }

        if (select) {
            return (
                <TextField
                    select
                    fullWidth
                    label={label}
                    value={value}
                    onChange={(e) => onChange(field, e.target.value)}
                    variant="outlined"
                    size="small"
                >
                    {selectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        }

        return (
            <TextField
                fullWidth
                label={label}
                variant="outlined"
                size="small"
                name={field}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                sx={{ width: '100%', maxWidth: '300px' }}
            />
        );
    };
    //Renderizaciones de las secciones 
    const renderDashboardCards = () => ( //Se renderiza el contenido del tab 'Dashboard'
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
    const renderAlmacenContent = () => { //Se renderiza el contenido del tab 'Almacen'  
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
                            <ToastContainer />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    padding: '8px 16px', // Tamaño reducido del botón
                                    fontSize: '0.9rem', // Texto más pequeño
                                    maxWidth: '150px', // Ancho máximo
                                }}
                                onClick={showtoast}
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
                        marginTop: '100px',
                        height: '75%',
                        width: '25%',
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
                                    select
                                    label="Ubicación de Destino"
                                    variant="outlined"
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
                                    label="Area"
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    name="area"
                                    value={trasladoData.area}
                                    onChange={handleTrasladoInputChange}
                                    required
                                />
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
    const renderInventoryContent = () => {  //Se renderiza el contenido del tab 'Inventario'
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
    };
    const renderUserContent = () => { //Se renderiza el contenido del tab 'Perfil'
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
    };
    const renderConfigContent = () => { //Se renderiza el contenido del tab 'Configuración'



        const handleSearch = () => {
            const filteredData = inventoryData.filter(item =>
                item.codigo_lote.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.cliente.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setInventoryData(filteredData);
        };

        const exportInventory = () => {
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

        return (
            <Box sx={{ display: 'flex', height: '85vh', marginLeft: "20px", marginRight: "30rem" }}>
                <CssBaseline />
                <ToastContainer />
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
                            {inventoryData.map((item, index) => (
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
            </Box>
        );
    };

    const renderContent = () => {//Se controla el estado del tab
        switch (selectedTab) {

            case 'almacenes': //Se renderiza el contenido del tab 'Almacenes'
                return renderAlmacenContent();
            case 'perfil': //Se renderiza el contenido del tab 'Perfil'
                return renderUserContent();
            case 'inventario': //Se renderiza el contenido del tab 'Inventario'
                return renderInventoryContent();
            case 'configuracion': //Se renderiza el contenido del tab 'Configuración'
                return renderConfigContent();
            default:
                return renderDashboardCards();
        }
    };

    //En este return se renderiza el componente principal
    return (
        <Box sx={{ display: 'flex', height: '85vh', marginLeft: "20px", marginRight: "30rem" }}> {/* Contenedor principal ocupa toda la pantalla */}
            <CssBaseline />
            {/* Barra Superior */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>{/* Barra superior con el logo y el boton de menu */}
                <Toolbar>{/*Aqui se definen las propiedades de la barra superior*/}
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
                sx={{//En esta parte se definen las propiedades del div que contiene el menú lateral
                    width: drawerOpen ? 240 : 60,
                    flexShrink: 0,
                    height: '100vh',
                    transition: 'width 0.3s ease',
                    position: 'fixed',
                    top: 56, // Alinea con la barra superior
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
                                    height: drawerOpen ? 'auto' : '48px',
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
                component="main"// Se establece el componente principal
                sx={{ // Se definen las propiedades del div que contiene el contenido
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
                {renderContent()} { /*Se manda a llamar a la función renderContent() para renderizar el contenido dependiendo del estado del tab*/}
            </Box>
        </Box>

    );
};

export default Dashboard;